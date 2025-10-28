import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  OnDestroy,
  DestroyRef,
  effect,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ApiSuffixesEnum, User } from '@shared/models';
import { FullNamePipe } from '@shared/ui';

import { UserSearchStore } from '../data-access/user-search.store';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { notAnObject } from '@core/validators';
import { debounceTime, startWith, filter } from 'rxjs';
import { BASE_API_SUFFIX, BaseCrudApiService } from '@shared/api';

const imports = [
  MatFormFieldModule,
  MatAutocompleteModule,
  MatInputModule,
  ReactiveFormsModule,
  FullNamePipe,
];
@Component({
  selector: 'app-user-search-control',
  imports,
  templateUrl: './user-search-control.template.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  providers: [
    {
      provide: BASE_API_SUFFIX,
      useValue: ApiSuffixesEnum.USERS,
    },
    BaseCrudApiService,
    UserSearchStore,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSearchControlComponent implements OnInit, OnDestroy {
  readonly store = inject(UserSearchStore);
  readonly controlKey = input<string>('user');
  readonly lastPage = this.store.lastPage();

  display(user: User): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  search(searchTerm: string): void {
    this.store.findUser(searchTerm);
  }

  getMore(page: number): void {
    this.store.getMore(page);
  }

  private readonly _scrollListener: EventListener = this._onScroll.bind(this);
  private readonly _parentContainer = inject(ControlContainer);
  private readonly _destroyRef = inject(DestroyRef);

  readonly isDisabled = input<boolean>(false);
  readonly placeholder = input<string>('');
  readonly required = input<boolean>(true);
  readonly additionalValidatorFn = input<ValidatorFn>();
  readonly additionalValidatorFnErrorText = input<string>();

  readonly autocomplete = viewChild.required<MatAutocomplete>('autocomplete');

  readonly label = input<string>('');
  readonly defaultItem = input('', {
    transform: (
      item: User | null | string | undefined | Pick<User, 'id' | 'firstName' | 'lastName'>,
    ) => item || '',
  });

  currentPage = 1;

  get parentFormGroup(): FormGroup {
    return this._parentContainer.control as FormGroup;
  }

  get control(): AbstractControl {
    return this.parentFormGroup.controls[this.controlKey()] as AbstractControl;
  }

  get validators(): ValidatorFn[] {
    const validators: ValidatorFn[] = [notAnObject()];

    if (this.additionalValidatorFn()) {
      validators.push(this.additionalValidatorFn()!);
    }

    if (this.required()) {
      validators.push(Validators.required);
    }

    return validators;
  }

  constructor() {
    effect(() => {
      this.control.patchValue(this.defaultItem());
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.isDisabled() ? this.control.disable() : this.control.enable();
    });
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormControl<User | string | Pick<User, 'id' | 'firstName' | 'lastName'>>(
        this.defaultItem(),
        this.validators,
      ),
    );
    this._setupScrollListener();
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
    this.autocomplete()?.panel?.nativeElement?.removeEventListener('scroll', this._scrollListener);
  }

  onFocus(): void {
    this._listenControlChanges();
  }

  private _onScroll(event: Event): void {
    const container = event.currentTarget as HTMLElement;

    if (container.scrollHeight - container.scrollTop === container.clientHeight) {
      const scrollPosition = container.scrollTop;

      this.currentPage += 1;

      if (this.currentPage <= this.lastPage) {
        this.getMore(this.currentPage);

        container.scrollTop = scrollPosition;
      }
    }
  }

  private _setupScrollListener(): void {
    this.autocomplete()
      ?.opened.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._registerPanelScrollEvent());
  }

  private _registerPanelScrollEvent(): void {
    setTimeout(() => {
      const panel = this.autocomplete()?.panel;

      if (panel) {
        panel.nativeElement.addEventListener('scroll', this._scrollListener);
      }
    }, 0);
  }

  private _listenControlChanges(): void {
    this.control.valueChanges
      .pipe(
        debounceTime(300),
        startWith(''),
        filter((value) => typeof value === 'string'),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((seatchTerm) => this.search(seatchTerm));
  }
}

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  patchState,
  signalStoreFeature,
  type,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { EntityState } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, Observable, pipe, switchMap, tap } from 'rxjs';

import { BASE_MESSAGES, BASE_REDIRECT_URL } from './base-store.providers';
import {
  BaseEntity,
  BaseSummary,
  PaginatedResponse,
  QueryParameters,
  ApiSuffixesEnum,
} from '@shared/models';
import { BaseCrudApiService } from '@shared/api/base-crud-api.service';
import { SnackbarService } from '@core/services';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialog } from '@shared/ui/components/dialogs/confirm/confirm.dialog';

interface BaseState<T extends BaseEntity> {
  paginatedEntities: PaginatedResponse<T> | null;
  currentEntity: T | null;
  filters: BaseSummary | null;
}

export const withBaseMethods = <T extends BaseEntity>() =>
  signalStoreFeature(
    { state: type<EntityState<T>>() },
    withState<BaseState<T>>({
      paginatedEntities: null,
      currentEntity: null,
      filters: null,
    }),
    withMethods(
      (
        store,
        baseCrudApiService = inject(BaseCrudApiService),
        messages = inject(BASE_MESSAGES),
        dialog = inject(MatDialog),
        snackbarService = inject(SnackbarService),
        router = inject(Router),
        redirectUrl: ApiSuffixesEnum | null = inject(BASE_REDIRECT_URL, {
          optional: true,
        }),
      ) => {
        function getDialogRef<TData = T, TResult = TData>(
          component: ComponentType<unknown>,
          data: TData | null = null,
        ): Observable<TResult> {
          const config: MatDialogConfig = { data, width: '600px' };

          return dialog.open(component, config).afterClosed().pipe(filter(Boolean));
        }

        const actions = {
          getFilters: rxMethod<void>(
            pipe(
              switchMap(() =>
                baseCrudApiService.summary().pipe(
                  tap({
                    next: (response) => {
                      patchState(store, { filters: response });
                    },
                    error: () => {
                      patchState(store, { filters: null });
                    },
                  }),
                ),
              ),
            ),
          ),
          searchEntities: rxMethod<Partial<QueryParameters>>(
            pipe(
              switchMap((params: Partial<QueryParameters>) =>
                baseCrudApiService.search(params).pipe(
                  tap({
                    next: (response) => {
                      patchState(store, {
                        paginatedEntities: response,
                      });
                    },
                    error: () => {
                      patchState(store, { paginatedEntities: null });
                    },
                  }),
                ),
              ),
            ),
          ),
          findOneEntity: rxMethod<string>(
            pipe(
              switchMap((id: string) =>
                baseCrudApiService.findOne(id).pipe(
                  tap({
                    next: (entity) => {
                      patchState(store, { currentEntity: entity });
                    },
                    error: () => {
                      patchState(store, { currentEntity: null });
                    },
                  }),
                ),
              ),
            ),
          ),
          createEntity: rxMethod<ComponentType<unknown>>(
            pipe(
              switchMap((component: ComponentType<unknown>) =>
                getDialogRef<null, T>(component, null).pipe(
                  switchMap((data: T) =>
                    baseCrudApiService.create(data).pipe(
                      tap({
                        next: (response) => {
                          actions.searchEntities({ size: 20, current: 1 });

                          snackbarService.open(messages.createSuccessMessage, 'success');

                          if (redirectUrl) {
                            router.navigate([`/${redirectUrl}`, response.id]);
                          }
                        },
                        error: () => {
                          patchState(store, { paginatedEntities: store.paginatedEntities()! });
                          snackbarService.open(messages.createErrorMessage, 'error');
                        },
                      }),
                    ),
                  ),
                ),
              ),
            ),
          ),
          deleteEntity: rxMethod<string>(
            pipe(
              switchMap((entityId: string) => {
                const config: MatDialogConfig = {
                  width: '600px',
                  data: messages.removeMessage,
                };
                return dialog
                  .open(ConfirmDialog, config)
                  .afterClosed()
                  .pipe(
                    filter(Boolean),
                    switchMap(() =>
                      baseCrudApiService.delete(entityId).pipe(
                        tap({
                          next: () => {
                            patchState(store, {
                              paginatedEntities: {
                                ...store.paginatedEntities()!,
                                results:
                                  store
                                    .paginatedEntities()
                                    ?.results?.filter((entity) => entity.id !== entityId) ?? [],
                              },
                            });
                            snackbarService.open(messages.removeSuccessMessage, 'success');
                          },
                          error: () => {
                            patchState(store, {
                              paginatedEntities: store.paginatedEntities(),
                            });
                            snackbarService.open(messages.removeErrorMessage, 'error');
                          },
                        }),
                      ),
                    ),
                  );
              }),
            ),
          ),
          updateEntity: rxMethod<{
            // I dont like types here, but no idea how to fix it so far
            component: ComponentType<unknown>;
            data: unknown;
            entityId: string;
          }>(
            pipe(
              switchMap(({ component, data, entityId }) =>
                getDialogRef<unknown, T>(component, data as T | null).pipe(
                  switchMap((entity: T) =>
                    baseCrudApiService.update(entityId, entity).pipe(
                      tap({
                        next: (response) => {
                          patchState(store, {
                            paginatedEntities: {
                              ...store.paginatedEntities()!,
                              results:
                                store
                                  .paginatedEntities()
                                  ?.results?.map((entity) =>
                                    entity.id === response.id ? response : entity,
                                  ) ?? [],
                            },
                            currentEntity: response,
                          });
                          snackbarService.open(messages.updateSuccessMessage, 'success');
                        },
                        error: () => {
                          patchState(store, { paginatedEntities: store.paginatedEntities()! });
                          snackbarService.open(messages.updateErrorMessage, 'error');
                        },
                      }),
                    ),
                  ),
                ),
              ),
            ),
          ),
        };

        return actions;
      },
    ),
    withHooks({
      onInit({ getFilters }) {
        getFilters();
      },
    }),
  );

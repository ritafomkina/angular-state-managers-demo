import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { QueryParameters, PaginatedResponse, BaseEntity, BaseSummary } from '@shared/models';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/environments/environment';

export const BASE_API_SUFFIX = new InjectionToken<string>('an abstraction for the api path suffix');
@Injectable()
export class BaseCrudApiService<
  Entity extends BaseEntity,
  Summary extends BaseSummary = BaseSummary,
> {
  protected readonly _suffix = inject(BASE_API_SUFFIX);

  protected readonly _http: HttpClient = inject(HttpClient);
  protected readonly _environment = ENVIRONMENT;

  create(body: Entity): Observable<Entity> {
    return this._http.post<Entity>(`${this._environment.baseUrl}/${this._suffix}/`, body);
  }

  findOne(id: string): Observable<Entity> {
    return this._http.get<Entity>(`${this._environment.baseUrl}/${this._suffix}/${id}/`);
  }

  update<Body>(id: string, body: Body): Observable<Entity> {
    return this._http.patch<Entity>(`${this._environment.baseUrl}/${this._suffix}/${id}/`, body);
  }

  delete(id: string): Observable<Entity> {
    return this._http.delete<Entity>(`${this._environment.baseUrl}/${this._suffix}/${id}/`);
  }

  search(params: Partial<QueryParameters> = {}): Observable<PaginatedResponse<Entity>> {
    return this._http.get<PaginatedResponse<Entity>>(
      `${this._environment.baseUrl}/${this._suffix}/`,
      {
        params,
      },
    );
  }

  summary(): Observable<Summary> {
    return this._http.get<Summary>(`${this._environment.baseUrl}/${this._suffix}/summary/`);
  }
}

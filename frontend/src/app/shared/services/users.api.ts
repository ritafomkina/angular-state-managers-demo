import { inject, Injectable } from '@angular/core';

import { PaginatedResponse, QueryParameters, User, UsersSummary } from '@shared/models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _environment = ENVIRONMENT;
  private readonly _suffix = 'users';

  create(body: User): Observable<User> {
    return this._http.post<User>(`${this._environment.baseUrl}/${this._suffix}`, body);
  }

  findOne(id: string): Observable<User> {
    return this._http.get<User>(`${this._environment.baseUrl}/${this._suffix}/${id}`);
  }

  update<Body>(id: string, body: Body): Observable<User> {
    return this._http.patch<User>(`${this._environment.baseUrl}/${this._suffix}/${id}`, body);
  }

  delete(id: string): Observable<User> {
    return this._http.delete<User>(`${this._environment.baseUrl}/${this._suffix}/${id}`);
  }

  search(params: Partial<QueryParameters> = {}): Observable<PaginatedResponse<User>> {
    return this._http.get<PaginatedResponse<User>>(`${this._environment.baseUrl}/${this._suffix}`, {
      params,
    });
  }

  summary(): Observable<UsersSummary> {
    return this._http.get<UsersSummary>(`${this._environment.baseUrl}/${this._suffix}/summary`);
  }
}

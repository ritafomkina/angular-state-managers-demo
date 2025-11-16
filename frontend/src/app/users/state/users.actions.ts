import { QueryParameters, User } from 'src/app/shared/models';

export class SetUserId {
  static readonly type = '[Users] Set User Id';
  constructor(public id: string) {}
}

export class SetQueryParams {
  static readonly type = '[Users] Set Query Params';
  constructor(public query: QueryParameters) {}
}

export class LoadFilters {
  static readonly type = '[Users] Load Filters';
}

export class CreateUser {
  static readonly type = '[Users] Create User';
  constructor(public user: User) {}
}

export class UpdateUser<T> {
  static readonly type = '[Users] Update User';
  constructor(
    public userId: string,
    public data: T,
  ) {}
}

export class DeleteUser {
  static readonly type = '[Users] Delete User';
  constructor(public userId: string) {}
}

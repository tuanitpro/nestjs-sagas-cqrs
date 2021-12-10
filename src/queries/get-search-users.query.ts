import { QueryParamModel } from '@models/query-param.model';

export class GetSearchUsersQuery {
  constructor(public readonly payload: QueryParamModel) {}
}

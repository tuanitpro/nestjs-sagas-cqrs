import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UsersService } from '@/services/users.service';
import { GetSearchUsersQuery } from '../get-search-users.query';

@QueryHandler(GetSearchUsersQuery)
export class GetSearchUsersQueryHandler
  implements IQueryHandler<GetSearchUsersQuery>
{
  private readonly logger = new Logger(GetSearchUsersQueryHandler.name);
  constructor(private readonly services: UsersService) {}

  async execute(query: GetSearchUsersQuery) {
    this.logger.log('Async GetSearchUsersQueryHandler...');

    return this.services.searchAsync(query?.payload);
  }
}

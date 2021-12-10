import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UsersService } from '@/services/users.service';
import { GetAllUsersQuery } from '../get-all-users.query';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersQueryHandler
  implements IQueryHandler<GetAllUsersQuery>
{
  private readonly logger = new Logger(GetAllUsersQueryHandler.name);
  constructor(private readonly services: UsersService) {}

  async execute(query: GetAllUsersQuery) {
    this.logger.log('Async GetAllUsersQueryHandler...');
    return this.services.findAllAsync();
  }
}

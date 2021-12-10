import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { UsersService } from '@/services/users.service';
import { UserModel } from '@/models/user.model';
import { UsersAggregate } from '@/aggregates/users.aggregate';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  public constructor(
    private readonly service: UsersService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(
    command: CreateUserCommand,
  ): Promise<UserModel | Error> {
    try {
      const { model } = command;
      const user = await this.service.createAsync(model);
      if (user instanceof Error) {
        throw user;
      }

      const userAggregate = this.publisher.mergeObjectContext(
        new UsersAggregate(user.id),
      );
      userAggregate.createUser(user);
      userAggregate.commit();

      return user;
    } catch (e) {
      Logger.error(e, 'CreateUserCommandHandler.execute() Error Handler: ');
      return e;
    }
  }
}

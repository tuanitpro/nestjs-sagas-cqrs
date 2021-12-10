import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ModifyUserCommand } from '../modify-user.command';
import { UsersService } from '@/services/users.service';
import { UserModel } from '@/models/user.model';
import { UsersAggregate } from '@/aggregates/users.aggregate';

@CommandHandler(ModifyUserCommand)
export class ModifyUserCommandHandler
  implements ICommandHandler<ModifyUserCommand>
{
  public constructor(
    private readonly service: UsersService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(
    command: ModifyUserCommand,
  ): Promise<UserModel | Error> {
    try {
      const {id, model} = command
      const user = await this.service.updateAsync(id, model);
      if (user instanceof Error) {
        throw user;
      }

      const userAggregate = this.publisher.mergeObjectContext(
        new UsersAggregate(id),
      );
      userAggregate.modifyUser(model);
      userAggregate.commit();

      return user;
    } catch (e) {
      Logger.error(e, 'ModifyUsersCommandHandler.execute() Error Handler: ');
      return e;
    }
  }
}

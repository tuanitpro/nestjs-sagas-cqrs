import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveUserCommand } from '../remove-user.command';
import { UsersService } from '@/services/users.service';
import { UsersAggregate } from '@/aggregates/users.aggregate';

@CommandHandler(RemoveUserCommand)
export class RemoveUserCommandHandler
  implements ICommandHandler<RemoveUserCommand>
{
  public constructor(
    private readonly service: UsersService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: RemoveUserCommand): Promise<boolean | Error> {
    try {
      const { model } = command;
      const user = await this.service.deleteAsync(model?.id);
      if (user instanceof Error) {
        throw user;
      }

      const userAggregate = this.publisher.mergeObjectContext(
        new UsersAggregate(model?.id),
      );
      userAggregate.removeUser(model);
      userAggregate.commit();

      return user;
    } catch (e) {
      Logger.error(e, 'RemoveUserCommandHandler.execute() Error Handler: ');
      return e;
    }
  }
}

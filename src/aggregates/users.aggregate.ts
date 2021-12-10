import { AggregateRoot } from '@nestjs/cqrs';

import {
  UserCreatedEvent,
  UserModifiedEvent,
  UserRemovedEvent,
} from '../events';

export class UsersAggregate extends AggregateRoot {
  constructor(private readonly id: number) {
    super();
  }

  public createUser(payload: any) {
    this.apply(new UserCreatedEvent(payload));
  }

  public modifyUser(payload: any) {
    this.apply(new UserModifiedEvent(payload));
  }

  public removeUser(payload: any) {
    this.apply(new UserRemovedEvent(payload));
  }
}

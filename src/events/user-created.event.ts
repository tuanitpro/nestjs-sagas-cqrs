import { Logger } from '@nestjs/common';

export class UserCreatedEvent {
  public constructor(public readonly payload: any) {
    Logger.log('UserCreatedEvent called');
  }
}

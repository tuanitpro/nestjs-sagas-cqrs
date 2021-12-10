import { Logger } from '@nestjs/common';

export class UserRemovedEvent {
  public constructor(public readonly payload: any) {
    Logger.log('UserRemovedEvent called');
  }
}

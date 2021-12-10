import { Logger } from '@nestjs/common';

export class UserModifiedEvent {
  public constructor(public readonly payload: any) {
    Logger.log('UserModifiedEvent called');
  }
}

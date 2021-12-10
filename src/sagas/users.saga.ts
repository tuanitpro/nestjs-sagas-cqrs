import { SendEmailCommand } from '../commands/send-email.command';
import {
  UserCreatedEvent,
  UserModifiedEvent,
  UserRemovedEvent,
} from '@events/index';
import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable()
export class UsersSaga {
  @Saga()
  userCreatedSagaEvents = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserCreatedEvent),
      delay(1000),
      map((event) => {
        Logger.log('saga call SendEmailCommand When UserCreatedEvent');
        const { contactPerson } = event?.payload;
        return new SendEmailCommand(
          contactPerson?.email,
          'UserCreatedEvent',
          'data',
        );
      }),
    );
  };

  @Saga()
  userModifiedSagaEvents = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserModifiedEvent),
      delay(1000),
      map((event) => {
        Logger.log('saga call SendEmailCommand When UserModifiedEvent');
        const { contactPerson } = event?.payload;
        return new SendEmailCommand(
          contactPerson?.email,
          'UserModifiedEvent',
          'data',
        );
      }),
    );
  };

  @Saga()
  userRemovedSagaEvents = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserRemovedEvent),
      delay(1000),
      map((event) => {
        Logger.log('saga call SendEmailCommand When UserRemovedEvent');
        const { contactPerson } = event?.payload;
        return new SendEmailCommand(
          contactPerson?.email,
          'UserRemovedEvent',
          'data',
        );
      }),
    );
  };
}

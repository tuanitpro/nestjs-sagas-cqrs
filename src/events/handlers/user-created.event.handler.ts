import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Inject, Logger } from '@nestjs/common'
import { UserCreatedEvent } from '../user-created.event'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { ConfigService } from '@nestjs/config'
import { EventName } from '@utils/constanst'
import { MessagingPayload } from '@models/messaging.payload'

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
    implements IEventHandler<UserCreatedEvent>
{
    private readonly logger = new Logger(UserCreatedEventHandler.name)
    constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly configService: ConfigService,
    ) {}
    handle(event: UserCreatedEvent) {
        this.logger.log('UserCreatedEventHandler called')

        const messagingPayload: MessagingPayload = new MessagingPayload(
            event?.payload,
        )
        this.amqpConnection.publish(
            this.configService.get<string>('rabbitmq.exchange'),
            EventName.SendEmailEvent,
            messagingPayload,
        )
        return event
    }
}

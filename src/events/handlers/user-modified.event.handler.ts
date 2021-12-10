import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Inject, Logger } from '@nestjs/common'
import { UserModifiedEvent } from '../user-modified.event'
import { ConfigService } from '@nestjs/config'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { MessagingPayload } from '@models/messaging.payload'
import { EventName } from '@utils/constanst'

@EventsHandler(UserModifiedEvent)
export class UserModifiedEventHandler
    implements IEventHandler<UserModifiedEvent>
{
    private readonly logger = new Logger(UserModifiedEventHandler.name)
    constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly configService: ConfigService,
    ) {}
    handle(event: UserModifiedEvent) {
        this.logger.log('UserModifiedEventHandler called')
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

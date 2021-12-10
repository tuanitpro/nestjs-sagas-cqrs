import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

import { Inject, Logger } from '@nestjs/common'
import { UserRemovedEvent } from '../user-removed.event'
import { ConfigService } from '@nestjs/config'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { MessagingPayload } from '@models/messaging.payload'
import { EventName } from '@utils/constanst'

@EventsHandler(UserRemovedEvent)
export class UserRemovedEventHandler
    implements IEventHandler<UserRemovedEvent>
{
    private readonly logger = new Logger(UserRemovedEventHandler.name)
    constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly configService: ConfigService,
    ) {}
    handle(event: UserRemovedEvent) {
        this.logger.log('UserRemovedEventHandler called')
        const messagingPayload: MessagingPayload = new MessagingPayload(event)
        this.amqpConnection.publish(
            this.configService.get<string>('rabbitmq.exchange'),
            EventName.SendEmailEvent,
            messagingPayload,
        )
        return event
    }
}

import { Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { MessagingPayload } from '@models/messaging.payload'
import { SendEmailCommand } from '../send-email.command'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { ConfigService } from '@nestjs/config'
import { EventName } from '@/utils/constanst'

@CommandHandler(SendEmailCommand)
export class SendEmailCommandHandler
    implements ICommandHandler<SendEmailCommand>
{
    private readonly logger = new Logger(SendEmailCommandHandler.name)
    public constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly configService: ConfigService,
    ) {}
    async execute(command: SendEmailCommand): Promise<any> {
        try {
            this.logger.log('SendEmailCommandHandler.execute()')
            const messagingPayload: MessagingPayload = new MessagingPayload(
                command,
            )
            this.amqpConnection.publish(
                this.configService.get<string>('rabbitmq.exchange'),
                EventName.SendEmailEvent,
                messagingPayload,
            )
        } catch (e) {
            this.logger.error(
                e,
                'SendEmailCommandHandler.execute() Error Handler: ',
            )
            return e
        }
    }
}

import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { Injectable, Logger } from '@nestjs/common'
import { MessagingPayload } from '@models/messaging.payload'

@Injectable()
export class MessagingService {
    private readonly logger = new Logger(MessagingService.name)
    constructor() {}
    @RabbitSubscribe({
        exchange: 'amp.service.order.topic',
        routingKey: 'OrderCheckOutEvent',
        queue: 'ORDER_SERVICE_QUEUE',
    })
    public async sendEmailHandler(msg: MessagingPayload) {
        console.log('sendEmailHandler', msg)
        try {
        } catch (e) {
            this.logger.error(e)
        }
    }
}

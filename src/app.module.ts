import {
    Module,
    NestModule,
    MiddlewareConsumer
} from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { TerminusModule } from '@nestjs/terminus'
import { APP_GUARD } from '@nestjs/core'
import { HttpModule } from '@nestjs/axios'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { AutomapperModule } from '@automapper/nestjs'
import { pojos } from '@automapper/pojos'
import { UsersProfile } from './users.profile'
import { UsersService } from '@/services/users.service'
import { UsersController } from '@/controllers/users.controller'
import { HealthController } from '@controllers/health.controller'
import configuration from './configuration'

import {
    GetAllUsersQueryHandler,
    GetSearchUsersQueryHandler,
} from '@queries/handlers/index'
import {
    CreateUserCommandHandler,
    RemoveUserCommandHandler,
    SendEmailCommandHandler,
    ModifyUserCommandHandler,
} from '@commands/handlers/index'
import {
    UserRemovedEventHandler,
    UserModifiedEventHandler,
    UserCreatedEventHandler,
} from '@events/handlers/index'
import { UsersSaga } from '@sagas/users.saga'
import { PrismaService } from '@services/prisma.service'
import { MessagingService } from '@services/messaging.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            load: [configuration],
        }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: () => ({
                timeout: 5000,
                maxRedirects: 5,
            }),
        }),
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                exchanges: [
                    {
                        name: configService.get<string>('rabbitmq.exchange'),
                        type: 'topic',
                    },
                ],
                uri: configService.get<string>('rabbitmq.host'),
                connectionInitOptions: { wait: true },
            }),
        }),
        CqrsModule,
        TerminusModule,
        AutomapperModule.forRoot({
            options: [{ name: 'userMapper', pluginInitializer: pojos }],
            singular: true,
        }),
    ],
    controllers: [HealthController, UsersController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        ConfigService,
        MessagingService,
        UsersService,
        PrismaService,
        UsersProfile,
        GetAllUsersQueryHandler,
        GetSearchUsersQueryHandler,
        CreateUserCommandHandler,
        ModifyUserCommandHandler,
        RemoveUserCommandHandler,
        SendEmailCommandHandler,
        UserCreatedEventHandler,
        UserModifiedEventHandler,
        UserRemovedEventHandler,
        UsersSaga,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // consumer.apply(RequestContextMiddleware).forRoutes('*');
    }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Req,
  Res,
  Body,
  UseGuards,
  UseInterceptors,
  Query,
  Inject,
  Logger,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request, Response } from 'express';
import { UsersService } from '@/services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserModel } from '@/models/user.model';
import { QueryParamModel } from '@models/query-param.model';
import { PaginationModel } from '@models/pagination.model';

import { v4 as uuidv4 } from 'uuid';
import {
  CreateUserCommand,
  ModifyUserCommand,
  RemoveUserCommand,
} from '@commands/index';
import { GetSearchUsersQuery, GetAllUsersQuery } from '@queries/index';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly service: UsersService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async findAll(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    this.logger.log('findAll');

    const result = await this.queryBus.execute(new GetAllUsersQuery());
    return response.status(200).json(result);
  }
  
  @Get('search')
  async search(
    @Req() request: Request,
    @Query() queryParamModel: QueryParamModel,
    @Res() response: Response,
  ): Promise<any> {
    const result = await this.queryBus.execute(
      new GetSearchUsersQuery(queryParamModel),
    );

    return response.status(200).json(result);
  }

  @Get(':id')
  async findById(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<any> {
    const user: UserModel | Error = await this.service.findByIdAsync(
      id,
    );
    if (user instanceof Error) {
      return response.status(404).json();
    }

    return response.status(200).json(user);
  }

  @Post()
  async post(
    @Body() model: UserModel,
    @Res() response: Response,
  ): Promise<any> {
    const result = await this.commandBus.execute(
      new CreateUserCommand(model),
    );
    if (result instanceof Error) {
      return response.status(400).json(result);
    }
    return response.status(201).json(result);
  }

  @Put(':id')
  async put(
    @Param('id') id: number,
    @Body() model: UserModel,
    @Res() response: Response,
  ): Promise<any> {
    model.id = id;

    const result = await this.commandBus.execute(
      new ModifyUserCommand(id, model),
    );
    if (result instanceof Error) {
      return response.status(400).json(result);
    }

    return response.status(200).json({ result });
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<any> {
    const user: UserModel | Error = await this.service.findByIdAsync(
      id,
    );

    if (user instanceof Error) {
      return response.status(404).json();
    }

    const result = await this.commandBus.execute(
      new RemoveUserCommand(user),
    );
    if (result) {
      return response.status(204).json({ result });
    }

    return response.status(404).json();
  }

  @MessagePattern('SendEmailCommand')
  async sendEmailCommand(@Payload() data: any) {
    console.log('SubscriblerContext SendEmailCommand', data);
  }

  @EventPattern('UserCreatedEvent')
  async UserCreatedEvent(@Payload() data: any) {
    console.log('SubscriblerContext UserCreatedEvent', data);
  }
}

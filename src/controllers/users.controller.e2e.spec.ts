import * as request from 'supertest';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '@/services/users.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/configuration';
import { PrismaService } from '@services/prisma.service';
import { UsersProfile } from '../users.profile';
import { AutomapperModule } from '@automapper/nestjs';
import { pojos } from '@automapper/pojos';
import { v4 as uuidv4 } from 'uuid';

describe('UsersController', () => {
  let app: INestApplication;
  let accountId: string = uuidv4();
  let userId: number = 0;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          load: [configuration],
        }),
        AutomapperModule.forRoot({
          options: [{ name: 'userMapper', pluginInitializer: pojos }],
          singular: true,
        }),
      ],
      providers: [
        UsersService,
        ConfigService,
        PrismaService,
        UsersProfile,
      ],
      controllers: [UsersController],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  it(`GET: get list users`, async () => {
    return request(app.getHttpServer()).get('/user').expect(200);
  });

  it(`GET: get find by id`, async () => {
    return request(app.getHttpServer()).get('/user/10').expect(200);
  });

  it(`POST: create user`, async () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({
        ownerContactOffice: uuidv4(),
        ownerPhoneNumber: '123456',
        businessName: 'Tuan',
        arcaNo: uuidv4(),
        registeredAddress: {
          country: 'Singapore',
          state: 'Singapore',
          city: 'Singapore',
          postalCode: '123456',
          street1: 'Line 1',
          street2: 'Line 2',
          building: 'BUIDING 1',
          blockNumber: '1',
          unitNumber: '1',
        },
        billingAddress: {
          country: 'Singapore',
          state: 'Singapore',
          city: 'Singapore',
          postalCode: '123456',
          street1: 'Line 1',
          street2: 'Line 2',
          building: 'BUIDING 2',
          blockNumber: '2',
          unitNumber: '2',
        },
        contactPerson: {
          firstName: 'Tuan',
          middleName: 'Thanh',
          lastName: 'Le',
          email: 'aaa@aa.com',
          phoneNumber: '',
          contactOffice: '',
        },
        billingPerson: {
          firstName: 'Tuan',
          middleName: 'Thanh',
          lastName: 'Le',
          email: 'aaa@aa.com',
          phoneNumber: '',
          contactOffice: '',
        },
        companyPrefix: uuidv4(),
        userType: 'Company',
      })
      .expect(201);
  });

  it(`PUT: update user`, async () => {
    return request(app.getHttpServer())
      .put('/user/1')
      .send({
        id: 1,
        firstName: 'Tuan',
        lastName: 'Le Thanh',
        isActive: true,
      })
      .expect(200);
  });

  it(`DELETE: user`, async () => {
    return request(app.getHttpServer()).delete('/user/10').expect(204);
  });

  afterAll(async () => {
    await app?.close();
  });
});

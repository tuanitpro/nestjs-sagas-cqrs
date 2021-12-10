import * as request from 'supertest';

import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import configuration from '@/configuration';

import { ConfigModule } from '@nestjs/config';

describe('HealthController', () => {
  let app: INestApplication;
  let controller: HealthController;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        TerminusModule,
        ConfigModule.forRoot({
          envFilePath: '.env',
          load: [configuration],
        }),
      ],
      providers: [],
      controllers: [HealthController],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
    controller = moduleRef.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it(`GET: health check`, async () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });
});

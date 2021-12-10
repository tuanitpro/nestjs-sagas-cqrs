import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@/services/users.service';
import configuration from '@/configuration';
import { ConfigModule } from '@nestjs/config';
import { UsersProfile } from '../users.profile';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('UsersService', () => {
  let service: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          load: [configuration],
        }),

        AutomapperModule.forRoot({
          options: [{ name: 'one_mapper', pluginInitializer: classes }],
          singular: true,
        }),
      ],
      providers: [UsersProfile, UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

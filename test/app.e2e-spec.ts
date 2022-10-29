import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DatabaseService } from '../src/database/database.service';
import { AppModule } from '../src/app.module';

describe('App e2e', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Only DTO fields are allowed.
      }),
    );
    await app.init();

    databaseService = app.get(DatabaseService);
    await databaseService.cleanDbInOrder();
  });

  afterAll(async () => {
    // Closes database connection too.
    await app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it.todo('Should signup');
    });

    describe('Signin', () => {
      it.todo('Should signin');
    });
  });

  describe('User', () => {
    describe('Get me', () => {});

    describe('Edit user', () => {});

    describe('Delete user', () => {});
  });

  describe('Bookmark', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark', () => {});

    describe('Delete bookmark', () => {});
  });
});

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
    })
      .compile();
    
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
    await app.close();
  });

  it.todo('Should pass')
});

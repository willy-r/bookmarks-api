import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { DatabaseService } from '../src/database/database.service';
import { AppModule } from '../src/app.module';
import { SignInAuthDto, SignUpAuthDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const PORT = 3001;
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Only DTO fields are allowed.
      }),
    );
    await app.init();
    await app.listen(PORT);

    databaseService = app.get(DatabaseService);
    await databaseService.cleanDbInOrder();

    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  afterAll(async () => {
    // Closes database connection too.
    await app.close();
  });

  describe('Auth', () => {
    const signUpDto: SignUpAuthDto = {
      email: 'test@gmail.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'Test',
    };
    const signInDto: SignInAuthDto = {
      email: signUpDto.email,
      password: signUpDto.password,
    };

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            password: signUpDto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            email: signUpDto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should signup', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson(signUpDto)
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson({
            password: signInDto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson({
            email: signInDto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should signin', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson(signInDto)
          .expectStatus(HttpStatus.OK)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .get('/users/me')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Edit user', () => {});

    describe('Delete user', () => {});
  });

  describe('Bookmark', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark by id', () => {});

    describe('Delete bookmark by id', () => {});
  });
});

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { DatabaseService } from '../src/database/database.service';
import { AppModule } from '../src/app.module';
import { SignInAuthDto, SignUpAuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const PORT = 3002;
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

    describe('Edit user', () => {
      const dto: EditUserDto = {
        email: 'edited@gmail.com',
        firstName: 'Edited',
        lastName: 'Edited',
      };

      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .patch('/users')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should throw if invalid email', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withJson({
            email: 'test',
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should edit logged user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withJson(dto)
          .expectStatus(HttpStatus.OK)
          .expectJsonLike(dto);
      });
    });

    describe('Delete user', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .delete('/users')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should delete logged user', () => {
        return pactum
          .spec()
          .delete('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.NO_CONTENT);
      });
    });
  });

  describe.skip('Bookmark (problem on test configuration)', () => {
    describe('Get empty bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(0);
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'Test',
        link: 'https://example.com/',
        description: 'Testing',
      };

      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should throw if missing required fields', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withJson({
            description: dto.description,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should create a bookmark for logged user', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withJson(dto)
          .expectStatus(HttpStatus.CREATED)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by id', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'Edited',
        link: 'https://edited.com',
        description: 'Edited',
      };

      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should edit bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withJson(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{bookmarkId}')
          .expectJsonLike(dto);
      });
    });

    describe('Delete bookmark by id', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.NO_CONTENT);
      });

      it('should get empty bookmarks after deletion', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(0);
      });
    });
  });
});

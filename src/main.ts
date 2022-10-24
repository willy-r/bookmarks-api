import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = parseInt(process.env.APP_PORT) || 3001;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Only DTO fields are allowed.
    }),
  );

  await app.listen(PORT, () =>
    console.log(`Server listening on port ⚡ ${PORT}`),
  );
}
bootstrap();

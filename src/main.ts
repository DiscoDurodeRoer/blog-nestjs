import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:4000', 'http://localhost:4200', 'http://localhost:4500'],
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Blog dynamic')
    .setDescription('Blog dynamic API')
    .setVersion('1.0')
    .addBearerAuth({
      bearerFormat: 'JWT',
      type: 'http'
    }, 'jwt')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(3000);
}
bootstrap();

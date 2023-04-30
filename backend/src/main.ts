import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    snapshot:true
  });
  app.enableCors({
    credentials: true,
    origin:
      process.env.NODE_ENV === 'production'
        ? 'http://localhost:5173/'
        : ['http://localhost:5173/', 'http://localhost:5173/'],
    exposedHeaders: ['SET-COOKIE', 'AUTHORIZATION'],
  });
  await app.listen(5000);
}
bootstrap();

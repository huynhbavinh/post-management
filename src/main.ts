import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Swagger's configuration
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API docs for the system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // 👈 Access the documentation at /api/docs

  await app.listen(3000);
}
bootstrap()
  .then(() => {
    console.log('Server is running on http://localhost:3000');
    console.log(
      'API documentation is running on http://localhost:3000/api/docs',
    );
  })
  .catch((error) => console.error('Server is shutting down', error));

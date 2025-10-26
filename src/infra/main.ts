import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvService)

  const port = envService.get('PORT')

  const config = new DocumentBuilder()
    .setTitle('Spotly API')
    .setDescription('The Spotly API documentation')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port)
}
bootstrap();

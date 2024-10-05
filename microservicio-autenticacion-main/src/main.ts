import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.BACKEND_URL || 'localhost',
      port: Number(process.env.SHARED_PORT) || 3003,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.SERVER_PORT || 3002);
}
bootstrap();

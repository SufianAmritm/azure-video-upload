import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getSwaggerConfiguration } from './swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await getSwaggerConfiguration(app);

  const port = process.env.PORT;
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();

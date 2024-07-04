import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function getSwaggerConfiguration(app: NestExpressApplication) {
  const title = `Azure Video Upload`;
  const description = `The Azure Video Upload API description`;
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion('1.0')
    .addTag(`Azure Video Upload`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

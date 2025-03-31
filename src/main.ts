import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger/custom-logger.service';
import { AllExceptionsFilter } from './all-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger:new CustomLoggerService()
  });
  
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,   
    forbidNonWhitelisted: true, 
    transform: true,   
    
  }))
  app.setGlobalPrefix("api")
  await app.listen(5000);
}
bootstrap();

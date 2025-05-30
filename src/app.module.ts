import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParkingLotModule } from './parking-lot/parking-lot.module';
import { ThrottlerGuard ,ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomLoggerModule } from './custom-logger/custom-logger.module';
@Module({
  imports: [ParkingLotModule,
    ThrottlerModule.forRoot([{
      ttl:60000,
      limit:300000
    }]),
    CustomLoggerModule
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide:APP_GUARD,
    useClass:ThrottlerGuard
  }],
  
})
export class AppModule {}

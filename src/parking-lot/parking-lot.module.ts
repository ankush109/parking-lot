import { Module } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ParkingLotController } from './parking-lot.controller';
import { CustomLoggerModule } from '../custom-logger/custom-logger.module';

@Module({
  imports:[CustomLoggerModule],
  providers: [ParkingLotService],
  controllers: [ParkingLotController],
  exports: [ParkingLotService],
})
export class ParkingLotModule {}

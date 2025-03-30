import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { CreateParkingLotDto, ExpandParkingLotDto, ParkCarDto } from './dto/create-parking-lot.dto';
import { ParkingSlot } from './entities/parking-slot.entity';

@Controller('parking-lot')
export class ParkingLotController {
    constructor(private readonly parkingLotService: ParkingLotService) {}
        @Post()
        initialize(@Body() dto: CreateParkingLotDto) {
            return this.parkingLotService.initializeParkingSlot(dto);
          }
        @Patch()
        increment(@Body() dto:ExpandParkingLotDto){
            return this.parkingLotService.incrementParkingSlot(dto)
        }
        @Post("park")
        parkCar(@Body() dto:ParkCarDto){
            return this.parkingLotService.parkCar(dto)
        }
    
}

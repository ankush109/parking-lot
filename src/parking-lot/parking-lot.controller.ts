import { Body, Controller, Post } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';

@Controller('parking-lot')
export class ParkingLotController {
    constructor(private readonly parkingLotService: ParkingLotService) {}
        @Post()
        initialize(@Body() dto: CreateParkingLotDto) {
            return this.parkingLotService.initializeParkingSlot(dto);
          }
    
}

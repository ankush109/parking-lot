import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ClearSlotDto, CreateParkingLotDto, ExpandParkingLotDto, ParkCarDto } from './dto/create-parking-lot.dto';


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
        @Get("/registration_numbers/:color")
        getColor(@Param("color") color:string ){
            return this.parkingLotService.getCarByColor(color)
        }
        @Get("/slot_numbers/:color")
        getSlotsByColor(@Param("color") color:string){
            return this.parkingLotService.getSlotsByColor(color)
        }
        @Post("/clear")
        clearSlot(@Body() dto:ClearSlotDto){
            if (!dto.slot_number && !dto.car_registration_no) {
                throw new BadRequestException('Either slot_number or car_registration_no must be provided.');
              }
          
              if (dto.slot_number) {
                return this.parkingLotService.clearSlotBySlotNumber(dto.slot_number);
              } else {
                return this.parkingLotService.clearSlotByRegistrationNumber(dto.car_registration_no ? dto.car_registration_no :"" );
              }
        }
        @Get("/status")
        findAllOccupiedSlots(){
            return this.parkingLotService.getAllOccupiedSlots()
        }   
    
}

import { BadRequestException, Body, Controller, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ClearSlotDto, CreateParkingLotDto, ExpandParkingLotDto, ParkCarDto } from './dto/create-parking-lot.dto';


@Controller('parking-lot')
export class ParkingLotController {
    constructor(private readonly parkingLotService: ParkingLotService) { }
    @Post()
    initialize(@Body(ValidationPipe) CreateParkingLotDto: CreateParkingLotDto) {
        return this.parkingLotService.initializeParkingSlot(CreateParkingLotDto);
    }
    @Patch()
    increment(@Body(ValidationPipe) ExpandParkingLotDto: ExpandParkingLotDto) {
        return this.parkingLotService.incrementParkingSlot(ExpandParkingLotDto)
    }
    @Post("park")
    parkCar(@Body(ValidationPipe) ParkCarDto: ParkCarDto) {
        return this.parkingLotService.parkCar(ParkCarDto)
    }
    @Get("/registration_numbers/:color")
    getColor(@Param("color") color: string) {
        return this.parkingLotService.getCarByColor(color)
    }
    @Get("/slot_numbers/:color")
    getSlotsByColor(@Param("color") color: string) {
        return this.parkingLotService.getSlotsByColor(color)
    }
    @Get("/duration/:reg_no")
    getDuration(@Param("reg_no") reg_no:string){
        return this.parkingLotService.getDurationByRegistrationNumber(reg_no)
    }
    @Post("/clear")
    clearSlot(@Body(ValidationPipe) ClearSlotDto: ClearSlotDto) {
        if (!ClearSlotDto.slot_number && !ClearSlotDto.car_registration_no) {
            throw new BadRequestException('Either slot_number or car_registration_no must be provided.');
        }

        if (ClearSlotDto.slot_number) {
            return this.parkingLotService.clearSlotBySlotNumber(ClearSlotDto.slot_number);
        }
        if (ClearSlotDto.car_registration_no) {

            return this.parkingLotService.clearSlotByRegistrationNumber(ClearSlotDto.car_registration_no);

        }
    }
    @Get("/status")
    findAllOccupiedSlots() {
        return this.parkingLotService.getAllOccupiedSlots()
    }

}

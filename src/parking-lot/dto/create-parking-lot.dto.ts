import { IsOptional, IsNumber, IsString } from 'class-validator';
export class CreateParkingLotDto{
    number_of_slots :number
}
export class ExpandParkingLotDto {
    increment_slot: number;
  }

  export class ParkCarDto {
    car_reg_no: string;
    car_color: string;
  }
  
  export class FreeSlotDto {
    slot_number?: number;
    car_registration_no?: string;
  }


  export class ClearSlotDto {
    @IsOptional()
    @IsNumber()
    slot_number?: number;
  
    @IsOptional()
    @IsString()
    car_registration_no?: string;
  }
  
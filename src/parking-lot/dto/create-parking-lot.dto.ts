import { IsOptional, IsNumber, IsString, IsInt, Min } from 'class-validator';
export class CreateParkingLotDto {
  @IsInt({ message: 'number_of_slots must be an integer' })
  @Min(1, { message: 'number_of_slots must be at least 1' })
  number_of_slots: number;
}
export class ExpandParkingLotDto {
  @IsInt()
  @Min(1)
  increment_slot: number;
}

export class ParkCarDto {
  @IsString()
  car_reg_no: string;

  @IsString()
  car_color: string;
}

export class FreeSlotDto {
  @IsOptional()
  @IsInt()
  slot_number?: number;

  @IsOptional()
  @IsString()
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
  
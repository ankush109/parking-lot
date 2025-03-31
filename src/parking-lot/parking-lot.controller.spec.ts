import { Test, TestingModule } from '@nestjs/testing';
import { ParkingLotService } from './parking-lot.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CustomLoggerService } from '../custom-logger/custom-logger.service';

describe('ParkingLotService', () => {
  let service: ParkingLotService;
  let logger: CustomLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingLotService,CustomLoggerService],
    }).compile();

    service = module.get<ParkingLotService>(ParkingLotService);
    logger = module.get<CustomLoggerService>(CustomLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(logger).toBeDefined()
  });

  it('should initialize parking slots', () => {
    const result = service.initializeParkingSlot({ number_of_slots: 3 });
    expect(result.total_slots).toBe(3);
  });

  it('should park a car successfully', () => {
    service.initializeParkingSlot({ number_of_slots: 3 });

    const parkCarDto = { car_color: 'Red', car_reg_no: 'KA-01-AB-2211' };
    const result = service.parkCar(parkCarDto);

    expect(result).toHaveProperty('allocated_slot_number');
    expect(result.allocated_slot_number).toBe(1);
  });

  it('should throw error if parking is full', () => {
    service.initializeParkingSlot({ number_of_slots: 1 });

    service.parkCar({ car_color: 'Blue', car_reg_no: 'KA-02-XY-9999' });

    expect(() => {
      service.parkCar({ car_color: 'Red', car_reg_no: 'KA-01-AB-2211' });
    }).toThrow(BadRequestException);
  });

  it('should clear a slot by slot number', () => {
    service.initializeParkingSlot({ number_of_slots: 3 });
    service.parkCar({ car_color: 'Blue', car_reg_no: 'KA-02-XY-9999' });

    const result = service.clearSlotBySlotNumber(1);
    expect(result.freed_slot_number).toBe(1);
  });

  it('should throw an error when clearing an empty slot', () => {
    service.initializeParkingSlot({ number_of_slots: 3 });

    expect(() => {
      service.clearSlotBySlotNumber(1);
    }).toThrow(NotFoundException);
  });
});

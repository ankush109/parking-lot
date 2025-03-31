import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ParkingSlot } from './entities/parking-slot.entity';
import MinHeap from './utils/min-heap';
import { CreateParkingLotDto, ExpandParkingLotDto, ParkCarDto } from './dto/parking-lot.dto';
import { CustomLoggerService } from '../custom-logger/custom-logger.service';

const SERVICE_NAME = 'ParkingLotService';

@Injectable()
export class ParkingLotService {
    private parkingSlots = new Map<number, ParkingSlot>();
    private availableSlots = new MinHeap();

    constructor(private readonly logger: CustomLoggerService) {}

    private initializeSlots(startIndex: number, count: number) {
        for (let i = startIndex; i < startIndex + count; i++) {
            this.parkingSlots.set(i, { slot_no: i, isOccupied: false });
            this.availableSlots.insert(i);
        }
    }

    private getCarByRegistrationNo(registration_number: string) {
        return Array.from(this.parkingSlots.entries()).find(
            ([_, slot]) => slot.carRegNo === registration_number
        );
    }

    initializeParkingSlot(createParkingSlot: CreateParkingLotDto) {
        if (this.parkingSlots.size > 0) {
            this.logger.warn('Parking Slot has already been initialized!', SERVICE_NAME);
            throw new BadRequestException("Parking Slot has already been initialized!");
        }

        const { number_of_slots } = createParkingSlot;
        this.initializeSlots(1, number_of_slots);

        this.logger.log(`Initialized parking lot with ${number_of_slots} slots`, SERVICE_NAME);
        return { total_slots: this.parkingSlots.size };
    }

    incrementParkingSlot(expandParkingLotDto: ExpandParkingLotDto) {
        const { increment_slot } = expandParkingLotDto;
        const currentSlotSize = this.parkingSlots.size;

        this.initializeSlots(currentSlotSize + 1, increment_slot);

        this.logger.log(`Expanded parking lot by ${increment_slot} slots`, SERVICE_NAME);
        return { total_slots: this.parkingSlots.size };
    }

    parkCar(parkCarDto: ParkCarDto) {
        if (this.parkingSlots.size === 0)  throw new BadRequestException("Parking Slot is not initialized!");
        
        if (this.availableSlots.isEmpty())  throw new BadRequestException("Parking Slots are full!");

        const alreadyCarParked = this.getCarByRegistrationNo(parkCarDto.car_reg_no);
        if (alreadyCarParked) {
            this.logger.warn(`Car with registration ${parkCarDto.car_reg_no} already exists!`, SERVICE_NAME);
            throw new BadRequestException("Car with Registration number already exists!");
        }

        const slotNumber = this.availableSlots.extractMin();
        if (!slotNumber) {
            this.logger.warn("No available slots", SERVICE_NAME);
            throw new BadRequestException("No available slots");
        }

        this.parkingSlots.set(slotNumber, {
            slot_no: slotNumber,
            carColor: parkCarDto.car_color,
            carRegNo: parkCarDto.car_reg_no,
            isOccupied: true,
            entryTime: new Date(),
        });

        this.logger.log(`Allocated slot ${slotNumber} to car ${parkCarDto.car_reg_no}`, SERVICE_NAME);
        return { allocated_slot_number: slotNumber };
    }

    getCarByColor(color: string) {
        const requestedCars = Array.from(this.parkingSlots.values()).filter(slot => slot.carColor === color);

        if (requestedCars.length === 0) {
            this.logger.warn(`No cars found with color ${color}`, SERVICE_NAME);
            throw new NotFoundException("Car with color not found!");
        }

        return requestedCars.map(car => car.carRegNo);
    }

    getSlotsByColor(color: string) {
        const requestedSlots = Array.from(this.parkingSlots.values()).filter(slot => slot.carColor === color);

        if (requestedSlots.length === 0) {
            this.logger.warn(`No slots found for cars with color ${color}`, SERVICE_NAME);
            throw new NotFoundException("Car with color not found!");
        }

        return requestedSlots.map(slot => slot.slot_no);
    }

    clearSlotBySlotNumber(slotNumber: number) {
        const slot = this.parkingSlots.get(slotNumber);
        if (!slot || !slot.isOccupied) {
            this.logger.warn(`Slot ${slotNumber} is already free`, SERVICE_NAME);
            throw new NotFoundException("Slot is already free");
        }

        this.parkingSlots.set(slotNumber, { slot_no: slotNumber, isOccupied: false });
        this.availableSlots.insert(slotNumber);

        this.logger.log(`Freed slot ${slotNumber}`, SERVICE_NAME);
        return { freed_slot_number: slotNumber };
    }

    clearSlotByRegistrationNumber(registrationNumber: string) {
        const slotEntry = this.getCarByRegistrationNo(registrationNumber);

        if (!slotEntry) {
            this.logger.warn(`Car with registration ${registrationNumber} not found`, SERVICE_NAME);
            throw new NotFoundException("Car with this registration number not found");
        }

        const [slotNumber] = slotEntry;
        this.parkingSlots.set(slotNumber, { slot_no: slotNumber, isOccupied: false });
        this.availableSlots.insert(slotNumber);

        this.logger.log(`Freed slot ${slotNumber} occupied by car ${registrationNumber}`, SERVICE_NAME);
        return { freed_slot_number: slotNumber };
    }

    getDurationByRegistrationNumber(registrationNumber: string) {
        const slot = Array.from(this.parkingSlots.values()).find(slot => slot.carRegNo === registrationNumber);
        if (!slot) throw new BadRequestException("Car with given reg_no is not parked!");
        if (!slot.entryTime) throw new BadRequestException("Entry time is not set for this car!");

        const durationInMilliSeconds = new Date().getTime() - slot.entryTime.getTime();
        const durationInSeconds = Math.floor(durationInMilliSeconds / 1000);
        const durationInMinutes = Math.floor(durationInSeconds / 60);
        const durationInHours = Math.floor(durationInMinutes / 60);

        return `${durationInHours} hrs ${durationInMinutes % 60} mins ${durationInSeconds % 60} seconds`;
    }

    getAllOccupiedSlots() {
        const occupiedSlots = Array.from(this.parkingSlots.values()).filter(slot => slot.isOccupied);
        return occupiedSlots.map(({ slot_no, carRegNo, carColor }) => ({ slot_no, carRegNo, carColor }));
    }
}

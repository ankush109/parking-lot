import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ParkingSlot } from './entities/parking-slot.entity';
import MinHeap from './utils/min-heap';
import { CreateParkingLotDto, ExpandParkingLotDto, ParkCarDto } from './dto/parking-lot.dto';
import { CustomLoggerService } from '../custom-logger/custom-logger.service';

@Injectable()
export class ParkingLotService {
    private parkingSlots = new Map<number, ParkingSlot>();
    private availableSlots = new MinHeap();

    constructor(private readonly logger: CustomLoggerService) { }

    initializeParkingSlot(createParkingSlot: CreateParkingLotDto) {
        if (this.parkingSlots.size > 0) {
            this.logger.warn('Parking Slot has already been initialized!', 'ParkingLotService');
            throw new BadRequestException("Parking Slot has already been initialized!");
        }

        const { number_of_slots } = createParkingSlot;
        for (let i = 1; i <= number_of_slots; i++) {
            this.parkingSlots.set(i, { slot_no: i, isOccupied: false });
            this.availableSlots.insert(i);
        }

        this.logger.log(`Initialized parking lot with ${number_of_slots} slots`, 'ParkingLotService');
        return { total_slots: this.parkingSlots.size };
    }

    incrementParkingSlot(expandParkingLotDto: ExpandParkingLotDto) {
        const { increment_slot } = expandParkingLotDto;
        const currentSlotSize = this.parkingSlots.size;

        for (let i = 1; i <= increment_slot; i++) {
            const newSlotNo = currentSlotSize + i;
            this.parkingSlots.set(newSlotNo, { slot_no: newSlotNo, isOccupied: false });
            this.availableSlots.insert(newSlotNo);
        }

        this.logger.log(`Expanded parking lot by ${increment_slot} slots`, 'ParkingLotService');
        return { total_slots: this.parkingSlots.size };
    }

    parkCar(parkCarDto: ParkCarDto) {
        if (this.parkingSlots.size == 0) throw new BadRequestException("Parking Slot is not initialized!");
        if (this.availableSlots.isEmpty()) throw new BadRequestException("Parking Slots are full!");

        const alreadyCarParked = Array.from(this.parkingSlots.entries()).find(
            ([_, val]) => val.carRegNo === parkCarDto.car_reg_no
        );
        if (alreadyCarParked) {
            this.logger.warn(`Car with registration ${parkCarDto.car_reg_no} already exists!`, 'ParkingLotService');
            throw new BadRequestException("Car with Registration number already exists!");
        }

        const slot_number = this.availableSlots.extractMin();
        if (slot_number) {
            this.parkingSlots.set(slot_number, {
                slot_no: slot_number,
                carColor: parkCarDto.car_color,
                carRegNo: parkCarDto.car_reg_no,
                isOccupied: true,
                entryTime: new Date()
            });
        }

        this.logger.log(`Allocated slot ${slot_number} to car ${parkCarDto.car_reg_no}`, 'ParkingLotService');
        return { allocated_slot_number: slot_number };
    }

    getCarByColor(color: string) {
        const requestedCars = Array.from(this.parkingSlots.values()).filter(slot => slot.carColor === color);

        if (requestedCars.length === 0) {
            this.logger.warn(`No cars found with color ${color}`, 'ParkingLotService');
            throw new NotFoundException("Car with color not found!");
        }


        return requestedCars.map(car => car.carRegNo);
    }

    getSlotsByColor(color: string) {
        const requestedSlots = Array.from(this.parkingSlots.values()).filter(slot => slot.carColor === color);

        if (requestedSlots.length === 0) {
            this.logger.warn(`No slots found for cars with color ${color}`, 'ParkingLotService');
            throw new NotFoundException("Car with color not found!");
        }


        return requestedSlots.map(slot => slot.slot_no);
    }

    clearSlotBySlotNumber(slot_number: number) {
        const slot = this.parkingSlots.get(slot_number);
        if (!slot || !slot.isOccupied) {
            this.logger.warn(`Slot ${slot_number} is already free`, 'ParkingLotService');
            throw new NotFoundException("Slot is already free");
        }

        this.parkingSlots.set(slot_number, { slot_no: slot_number, isOccupied: false });
        this.availableSlots.insert(slot_number);

        this.logger.log(`Freed slot ${slot_number}`, 'ParkingLotService');
        return { freed_slot_number: slot_number };
    }

    clearSlotByRegistrationNumber(registration_number: string) {
        const slotEntry = Array.from(this.parkingSlots.entries()).find(
            ([_, slot]) => slot.carRegNo === registration_number
        );

        if (!slotEntry) {
            this.logger.warn(`Car with registration ${registration_number} not found`, 'ParkingLotService');
            throw new NotFoundException("Car with this registration number not found");
        }

        const [slot_number] = slotEntry;
        this.parkingSlots.set(slot_number, { slot_no: slot_number, isOccupied: false });
        this.availableSlots.insert(slot_number);

        this.logger.log(`Freed slot ${slot_number} occupied by car ${registration_number}`, 'ParkingLotService');
        return { freed_slot_number: slot_number };
    }
    getDurationByRegistrationNumber(registration_number: string) {
        const slot = Array.from(this.parkingSlots.values()).find((slot) => slot.carRegNo == registration_number)
        if (!slot) throw new BadRequestException("Car with given reg_no is not parked !")
        if (!slot.entryTime) throw new BadRequestException("Entry time is not set for this car !")
        const currentTime = new Date();
        const durationInMilliSeconds = currentTime.getTime() - slot?.entryTime.getTime()
        const durationInSeconds = Math.floor(durationInMilliSeconds / 1000)
        const durationInMinutes = Math.floor(durationInSeconds / 60)
        const durationInHours = Math.floor(durationInMinutes / 60)
        return `${durationInHours} hrs ${durationInMinutes % 60} mins ${durationInSeconds % 60} seconds`

    }
    getAllOccupiedSlots() {
        const occupiedSlots = Array.from(this.parkingSlots.values()).filter(slot => slot.isOccupied);


        return occupiedSlots.map(({ slot_no, carRegNo, carColor }) => ({ slot_no, carRegNo, carColor }));
    }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ParkingSlot } from './entities/parking-slot.entity';
import MinHeap from './utils/min-heap';
import { CreateParkingLotDto, ExpandParkingLotDto, ParkCarDto } from './dto/create-parking-lot.dto';

@Injectable()
export class ParkingLotService {
    private parkingSlots = new Map<number, ParkingSlot>();
    private availableSlots = new MinHeap();

    initializeParkingSlot(createParkingSlot: CreateParkingLotDto) {
        const { number_of_slots } = createParkingSlot;
        
        for (let i = 1; i <= number_of_slots; i++) {
            this.parkingSlots.set(i, { slot_no: i, isOccupied: false });
            this.availableSlots.insert(i);
        }

        return { total_slots: this.parkingSlots.size };
    }

    incrementParkingSlot(expandParkingLotDto: ExpandParkingLotDto) {
        const { increment_slot } = expandParkingLotDto;
        const currentSlotSize = this.availableSlots.size();

        for (let i = 1; i <= increment_slot; i++) {
            const newSlotNo = currentSlotSize + i;
            this.parkingSlots.set(newSlotNo, { slot_no: newSlotNo, isOccupied: false });
            this.availableSlots.insert(newSlotNo);
        }

        return { total_slots: this.parkingSlots.size };
    }

    parkCar(ParkCarDto: ParkCarDto) {
        if (this.availableSlots.isEmpty()) {
            throw new BadRequestException("Parking Slots are full!");
        }

        const slot_number = this.availableSlots.extractMin();
        if(slot_number){
            this.parkingSlots.set(slot_number, {
                slot_no: slot_number,
                carColor: ParkCarDto.car_color,
                carRegNo: ParkCarDto.car_reg_no,
                isOccupied: true
            });
        }

        return { allocated_slot_number: slot_number };
    }

    getCarByColor(color: string) {
        const requestedCars = Array.from(this.parkingSlots.values())
            .filter(slot => slot.carColor === color);
        
        if (requestedCars.length === 0) throw new NotFoundException("Car with color not found!");
        
        return requestedCars.map(car => car.carRegNo);
    }

    getSlotsByColor(color: string) {
        const requestedCars = Array.from(this.parkingSlots.values())
            .filter(slot => slot.carColor === color);
        
        if (requestedCars.length === 0) throw new NotFoundException("Car with color not found!");
        
        return requestedCars.map(car => car.slot_no);
    }

    clearSlotBySlotNumber(slot_number: number) {
        const slot = this.parkingSlots.get(slot_number);
        if (!slot || !slot.isOccupied) {
            throw new NotFoundException("Slot is already free");
        }

        this.parkingSlots.set(slot_number, { slot_no: slot_number, isOccupied: false });
        this.availableSlots.insert(slot_number);

        return { freed_slot_number: slot_number };
    }

    clearSlotByRegistrationNumber(registration_number: string) {
        const slotEntry = Array.from(this.parkingSlots.entries())
            .find(([_, slot]) => slot.carRegNo === registration_number);
        
        if (!slotEntry) {
            throw new NotFoundException("Slot is already free");
        }

        const [slot_number] = slotEntry;
        this.parkingSlots.set(slot_number, { slot_no: slot_number, isOccupied: false });
        this.availableSlots.insert(slot_number);

        return { freed_slot_number: slot_number };
    }

    getAllOccupiedSlots() {
        return Array.from(this.parkingSlots.values())
            .filter(slot => slot.isOccupied)
            .map(({ slot_no, carRegNo, carColor }) => ({ slot_no, carRegNo, carColor }));
    }
}

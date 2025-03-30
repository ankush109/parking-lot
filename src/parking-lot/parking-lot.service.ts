import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ParkingSlot } from './entities/parking-slot.entity';
import MinHeap from './utils/min-heap';
import { CreateParkingLotDto, ExpandParkingLotDto, ParkCarDto } from './dto/create-parking-lot.dto';

@Injectable()

export class ParkingLotService {
    private slots: ParkingSlot[] = []
    private availableSlots = new MinHeap()
    initializeParkingSlot(createParkingSlot: CreateParkingLotDto) {
        const { number_of_slots } = createParkingSlot;
        this.slots = Array.from({ length: number_of_slots }, (_, i) => ({
            slot_no: i + 1,
            isOccupied: false
        }))
        console.log(this.slots)
        for (let i = 1; i <= this.slots.length; i++) {
            this.availableSlots.insert(i)
        }
        return {
            total_slots: this.slots.length
        }
    }
    incrementParkingSlot(expandParkingLotDto: ExpandParkingLotDto) {
        const { increment_slot } = expandParkingLotDto
        const currentSlotSize = this.slots.length;
        for (let i = 1; i <= increment_slot; i++) {
            this.slots.push({
                slot_no: currentSlotSize + i,
                isOccupied: false
            })
            this.availableSlots.insert(currentSlotSize + i)
        }
        return {
            total_slots: this.slots.length
        }

    }
    parkCar(ParkCarDto: ParkCarDto) {
        if (this.availableSlots.isEmpty()) {
            throw new BadRequestException("Parking Slots are full!")
        }
        const slot_number = this.availableSlots.extractMin();
        const slot = this.slots.find((s) => s.slot_no == slot_number)
        if (!slot) throw new NotFoundException('Slot not found');

        slot.carColor = ParkCarDto.car_color;
        slot.carRegNo = ParkCarDto.car_reg_no;
        slot.isOccupied = true;

        this.availableSlots.watchHeap()
        return {
            allocated_slot_number: slot_number
        }
    }
}

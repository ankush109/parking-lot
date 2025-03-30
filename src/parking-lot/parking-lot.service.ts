import { Injectable } from '@nestjs/common';
import { ParkingSlot } from './entities/parking-slot.entity';
import MinHeap from './utils/min-heap';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';

@Injectable()

export class ParkingLotService {
    private slots:ParkingSlot[] =[]
    private availableSlots = new MinHeap()
    initializeParkingSlot(createParkingSlot:CreateParkingLotDto){
        const {number_of_slots} = createParkingSlot;
        this.slots = Array.from({length:number_of_slots},(_,i)=>({
            slot_no:i+1,
            isOccupied:false 
        }))
    console.log(this.slots)
    for(let i=1;i<=this.slots.length;i++){
        this.availableSlots.insert(i)
    }
    return {
        number_of_slots : number_of_slots
    }
    }
}

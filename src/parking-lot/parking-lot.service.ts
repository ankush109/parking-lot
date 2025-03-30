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
        console.log(slot_number,"slot free")
        const slot = this.slots.find((s) => s.slot_no == slot_number)
        if (!slot) throw new NotFoundException('Slot not found');

        slot.carColor = ParkCarDto.car_color;
        slot.carRegNo = ParkCarDto.car_reg_no;
        slot.isOccupied = true;

        this.availableSlots.watchHeap()
        console.log(this.slots,"slots after cleared")
        return {
            allocated_slot_number: slot_number
        }
    }
    getCarByColor(color:string){
        const requestedCar = this.slots.filter((car)=>car.carColor==color)
        if(requestedCar.length==0) throw new NotFoundException("Car with color not found!")
        const registrationNumbers = requestedCar.map((car)=>car.carRegNo)
        return registrationNumbers
    }
    getSlotsByColor(color:string){
        const requestedCar = this.slots.filter((car)=>car.carColor==color)
        if(requestedCar.length==0) throw new NotFoundException("Car with color not found!")
        const registrationNumbers = requestedCar.map((car)=>car.slot_no)
        return registrationNumbers
    }
    clearSlotBySlotNumber(slot_number:number){
       const findFreeSlot = this.slots.filter((slot)=>slot.slot_no==slot_number)
       console.log(findFreeSlot,"free")
       console.log(this.slots,"slots before being cleared")
       if(findFreeSlot.length==0) throw new NotFoundException("Slot is already free")
       this.slots = this.slots.filter((val)=>{
            return val.slot_no!=slot_number
        })
        this.slots.push({
            slot_no:1,
            isOccupied:false
        })
        this.availableSlots.insert(slot_number)
        this.availableSlots.watchHeap()
        console.log(this.slots,"slots after being cleared")
        return {
            reed_slot_number:slot_number
        }
    }
    clearSlotByRegistrationNumber(registration_number:string){
        const findFreeSlot = this.slots.filter((slot)=>slot.carRegNo==registration_number)
        console.log(findFreeSlot,"free")
        console.log(this.slots,"slots before being cleared")
        if(findFreeSlot.length==0) throw new NotFoundException("Slot is already free")

        this.slots = this.slots.filter((val)=>{
             return val.carRegNo!=registration_number
         })
         this.slots.push({
             slot_no:1,
             isOccupied:false
         })
         this.availableSlots.insert(findFreeSlot[0].slot_no)
         this.availableSlots.watchHeap()
         console.log(this.slots,"slots after being cleared")
         return {
             reed_slot_number:findFreeSlot[0].slot_no
         }
     }
     getAllOccupiedSlots(){
        const occupiedSlots = this.slots.filter((slot)=>slot.isOccupied==true)
        return occupiedSlots
     }
}

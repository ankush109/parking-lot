import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ParkingSlot } from './entities/parking-slot.entity';
import MinHeap from './utils/min-heap';
import { CreateParkingLotDto, ExpandParkingLotDto, ParkCarDto } from './dto/parking-lot.dto';
import { CustomLoggerService } from '../custom-logger/custom-logger.service';

const SERVICE_NAME = 'ParkingLotService';

@Injectable()


// based on duration charge 1rs / secs 
export class ParkingLotService {
    private parkingSlots = new Map<number, ParkingSlot[]>();
    private availableSlots :number[] = []

    constructor(private readonly logger: CustomLoggerService) { }

    private initializeSlots(startIndex: number, count: number) {
        for (let i = startIndex; i < startIndex + count; i++) {
            this.parkingSlots.set(i, [{ slot_no: i, isOccupied: false }]);
           this.availableSlots.push(i);
        }
    }

    private getSlotNumberByRegNo(registration_number: string) {
        const getSlotArea =  Array.from(this.parkingSlots.values());
        const findVehicle = getSlotArea.find((slotArea)=>{
            slotArea.find((slot)=>slot.carRegNo==registration_number)
        })
        return findVehicle

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
        if (this.parkingSlots.size === 0) throw new BadRequestException("Parking Slot is not initialized!");

        if (this.availableSlots.length==0) throw new BadRequestException("Parking Slots are full!");

        const alreadyCarParked = this.getSlotNumberByRegNo(parkCarDto.car_reg_no);
        if (alreadyCarParked) {
            this.logger.warn(`Car with registration ${parkCarDto.car_reg_no} already exists!`, SERVICE_NAME);
            throw new BadRequestException("Car with Registration number already exists!");
        }

   
        let parkingArea;
      for(let slotNumber=1;slotNumber<this.availableSlots.length;slotNumber++){
            if (!slotNumber) {
                this.logger.warn("No available slots", SERVICE_NAME);
                throw new BadRequestException("No available slots");
            }
             parkingArea = this.parkingSlots.get(slotNumber);
            let bikeCnt = 0;
            let carCnt = 0;
            console.log(parkingArea,"parkingare ***************")
            parkingArea?.map((slotarea) => {
                if (slotarea.type == "bike") bikeCnt++;
                else if(slotarea.type=="car"){
                    carCnt++;
                }
            })
            console.log(carCnt,"carcount");
            console.log(bikeCnt,"bikecnt")
            console.log(parkCarDto.vehicleType,"a")
            if (parkCarDto.vehicleType == "bike") {
                // if the vehicle to be parked is a bike 
                if (bikeCnt <= 1 && carCnt == 0) {
    
                    parkingArea?.push({
                        slot_no: slotNumber,
                        carColor: parkCarDto.car_color,
                        carRegNo: parkCarDto.car_reg_no,
                        isOccupied: true,
                        entryTime: new Date(),
                        type: "bike"
                    })
                    this.availableSlots.splice(slotNumber,-1);
                    this.logger.log(`Allocated slot ${slotNumber} to car ${parkCarDto.car_reg_no}`, SERVICE_NAME);
                    return { allocated_slot_number: slotNumber };
                   
                }
              
            } else {
                // if the vehicle to parked is a car
    
                if (bikeCnt == 0 && carCnt == 0) {
    
                    parkingArea?.push({
                        slot_no: slotNumber,
                        carColor: parkCarDto.car_color,
                        carRegNo: parkCarDto.car_reg_no,
                        isOccupied: true,
                        entryTime: new Date(),
                        type: "car"
                    })
                    console.log("parking",parkingArea)
                     this.availableSlots.splice(slotNumber,-1);
                     return { allocated_slot_number: slotNumber };
                }
               
            }
        }
    
        console.log(parkingArea,"parking area");
        console.log(this.parkingSlots,"parking slot")
        // this.parkingSlots.set(slotNumber, {
        //     slot_no: slotNumber,
        //     carColor: parkCarDto.car_color,
        //     carRegNo: parkCarDto.car_reg_no,
        //     isOccupied: true,
        //     entryTime: new Date(),
        // });


    }

getCarByColor(color: string) {
    const requestedCars = Array.from(this.parkingSlots.values())
    .flatMap(slot => slot
        .filter(area => area.carColor === color && area.isOccupied)
        .map(car => car.carRegNo)
    );


    if (requestedCars.length === 0) {
        this.logger.warn(`No cars found with color ${color}`, SERVICE_NAME);
        throw new NotFoundException("Car with color not found!");
    }

    return requestedCars
}

getSlotsByColor(color: string) {
    const requestedSlots = Array.from(this.parkingSlots.values()).flatMap((val)=>val.filter(((slot => slot.carColor === color))))

    if (requestedSlots.length === 0) {
        this.logger.warn(`No slots found for cars with color ${color}`, SERVICE_NAME);
        throw new NotFoundException("Car with color not found!");
    }

    return requestedSlots.map(slot => slot.slot_no);
}

// clearSlotBySlotNumber(slotNumber: number) {
//     const slot = this.parkingSlots.get(slotNumber);
//     if (!slot || !slot.isOccupied) {
//         this.logger.warn(`Slot ${slotNumber} is already free`, SERVICE_NAME);
//         throw new NotFoundException("Slot is already free");
//     }

//     this.parkingSlots.set(slotNumber, { slot_no: slotNumber, isOccupied: false });
//     this.availableSlots.insert(slotNumber);

//     this.logger.log(`Freed slot ${slotNumber}`, SERVICE_NAME);
//     return { freed_slot_number: slotNumber };
// }

// clearSlotByRegistrationNumber(registrationNumber: string) {
//     console.log(this.parkingSlots, "this.parking slots")
//     const slotEntry = this.getSlotNumberByRegNo(registrationNumber);
//     console.log(slotEntry, "slot entry.....")
//     if (!slotEntry) {
//         this.logger.warn(`Car with registration ${registrationNumber} not found`, SERVICE_NAME);
//         throw new NotFoundException("Car with this registration number not found");
//     }

//     const slotNumber = slotEntry;
//     this.parkingSlots.set(slotNumber, { slot_no: slotNumber, isOccupied: false });
//     this.availableSlots.insert(slotNumber);

//     this.logger.log(`Freed slot ${slotNumber} occupied by car ${registrationNumber}`, SERVICE_NAME);
//     return { freed_slot_number: slotNumber };
// }

// You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.
// Return true if you can reach the last index, or false otherwise.
// [2,3,1,1,4]

// getDurationByRegistrationNumber(registrationNumber: string) {
//     const slot = Array.from(this.parkingSlots.values()).find(slot => slot.carRegNo === registrationNumber);
//     if (!slot) throw new BadRequestException("Car with given reg_no is not parked!");
//     if (!slot.entryTime) throw new BadRequestException("Entry time is not set for this car!");

//     const durationInMilliSeconds = new Date().getTime() - slot.entryTime.getTime();
//     const durationInSeconds = Math.floor(durationInMilliSeconds / 1000);
//     const durationInMinutes = Math.floor(durationInSeconds / 60);
//     const durationInHours = Math.floor(durationInMinutes / 60);
//     const chargedAmmount = durationInSeconds * 1
//     // every 5 seconds the charge doubles :
//     // 5 -> 5  // 10 secs -> 10 // 20 ->  
//     // 5 -> 5 6-10 -> 2
//     // 20 secs -> 0-5 -> 1 5- 10 -> 2 10->15->4 15->20 -> 8 
//     // 10 secs ->  -> 
//     //  
//     let compoundedTimeMoney = 1;
//     let cnt = 1;
//     for (let i = 0; i < durationInSeconds; i++) {

//         if (cnt >= 5) {
//             cnt = 0;
//             compoundedTimeMoney *= 2;

//         }
//         else {
//             cnt = i;
//         }
//     }




//     return {
//         totalDuration: `${durationInHours} hrs ${durationInMinutes % 60} mins ${durationInSeconds % 60} seconds`,
//         pay: `Rs ${chargedAmmount}`
//     }
// }

getAllOccupiedSlots() {
    const occupiedSlots = Array.from(this.parkingSlots.values()).flatMap((val)=>val.filter((ok)=>ok.isOccupied))
    return occupiedSlots.map(({ slot_no, carRegNo, carColor ,type}) => ({ slot_no, carRegNo, carColor,type }));
}
}

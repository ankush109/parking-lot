export class ParkingSlot {
    slot_no: number;
    isOccupied: boolean;
    carRegNo?: string;
    carColor?: string;
    entryTime?:Date
  }

  export class Car {
    regNo: string;
    color: string;
  }
  
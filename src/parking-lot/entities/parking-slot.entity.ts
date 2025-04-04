export class ParkingSlot {
    slot_no: number;
    isOccupied: boolean;
    carRegNo?: string;
    carColor?: string;
    type? : "car" | "bike"
    entryTime?:Date
  }  
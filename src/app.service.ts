import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthy(): string {
    return 'Parking Lot Service is healthy!';
  }
}

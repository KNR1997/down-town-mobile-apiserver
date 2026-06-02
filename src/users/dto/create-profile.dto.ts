import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';

export class CreateProfileDto {
  bio: string;
  contact: string;
  // social: string;
}

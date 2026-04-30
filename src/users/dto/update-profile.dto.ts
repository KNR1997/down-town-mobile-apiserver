import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';

export class UpdateProfileDto {
  bio: string;
  contact: string;
  // social: string;
}

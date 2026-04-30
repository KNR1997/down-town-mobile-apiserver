import { Expose } from 'class-transformer';
import { AddressType } from '../entities/address.entity';

export class AddressDto {
  id?: number;
  title: string;
  type: AddressType;
  default: boolean;

  address: {
    zip: string;
    city: string;
    state: string;
    country: string;
    street_address: string;
  };

  location?: string;
}

export class AddressResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  type: AddressType;

  @Expose()
  default: boolean;

  @Expose()
  address: any;

  @Expose()
  location?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'Unique warehouse code identifier',
    example: 'WH-001',
    required: true,
  })
  @IsString()
  warehouse_code!: string;

  @ApiProperty({
    description: 'Name of the warehouse',
    example: 'Main Distribution Center',
    required: true,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description:
      'Detailed description of the warehouse (location, capacity, special features)',
    example: '50,000 sq ft climate-controlled facility with 20 loading docks',
  })
  @IsOptional()
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Street address of the warehouse',
    example: '123 Industrial Boulevard',
  })
  @IsOptional()
  @IsString()
  address_line_1!: string;

  @ApiProperty({
    description: 'Secondary address line (apartment, suite, building number)',
    example: 'Building B, Suite 200',
  })
  @IsString()
  @IsOptional()
  address_line_2!: string;

  @ApiProperty({
    description: 'City where the warehouse is located',
    example: 'Los Angeles',
  })
  @IsString()
  @IsOptional()
  city!: string;

  @ApiProperty({
    description: 'State or province where the warehouse is located',
    example: 'California',
  })
  @IsString()
  @IsOptional()
  state!: string;

  @ApiProperty({
    description: 'Postal/ZIP code of the warehouse location',
    example: '90001',
  })
  @IsString()
  @IsOptional()
  postal_code!: string;

  @ApiProperty({
    description: 'Country where the warehouse is located',
    example: 'United States',
  })
  @IsString()
  @IsOptional()
  country!: string;

  @ApiProperty({
    description: 'Contact email address for warehouse communications',
    example: 'warehouse@distribution.com',
    format: 'email',
  })
  @IsEmail()
  @IsOptional()
  email!: string;

  @ApiProperty({
    description: 'Primary contact phone number for the warehouse',
    example: '+14155552671',
  })
  @IsPhoneNumber()
  @IsOptional()
  phone!: string;

  @ApiProperty({
    description: 'Indicates whether the warehouse is currently active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active!: boolean;
}

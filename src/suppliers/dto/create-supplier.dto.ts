import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Unique supplier code identifier',
    example: 'SUP-001',
    required: true,
  })
  @IsString()
  supplier_code!: string;

  @ApiProperty({
    description: 'Legal name of the supplier company',
    example: 'Fresh Foods Distributors Inc.',
    required: true,
  })
  @IsString()
  company_name!: string;

  @ApiProperty({
    description: 'Full name of the primary contact person',
    example: 'John Smith',
    required: false,
  })
  @IsString()
  @IsOptional()
  contact_person!: string;

  @ApiProperty({
    description: 'Email address for supplier communications',
    example: 'contact@freshfoods.com',
    required: false,
    format: 'email',
  })
  @IsEmail()
  @IsOptional()
  email!: string;

  @ApiProperty({
    description: 'Primary phone number (work)',
    example: '+94788575120',
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  phone!: string;

  @ApiProperty({
    description: 'Mobile phone number for urgent communications',
    example: '+94788575120',
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  mobile!: string;

  @ApiProperty({
    description: 'Street address, building number, and name',
    example: '123 Main Street, Suite 100',
    required: false,
  })
  @IsString()
  @IsOptional()
  address_line_1!: string;

  @ApiProperty({
    description: 'Additional address information (floor, apartment, PO Box)',
    example: 'Floor 5, West Wing',
    required: false,
  })
  @IsString()
  @IsOptional()
  address_line_2!: string;

  @ApiProperty({
    description: 'City of the supplier location',
    example: 'New York',
    required: true,
  })
  @IsString()
  @IsOptional()
  city!: string;

  @ApiProperty({
    description: 'State or province of the supplier location',
    example: 'NY',
    required: true,
  })
  @IsString()
  @IsOptional()
  state!: string;

  @ApiProperty({
    description: 'Postal or ZIP code of the supplier location',
    example: '10001',
    required: true,
  })
  @IsString()
  @IsOptional()
  postal_code!: string;

  @ApiProperty({
    description: 'Country of the supplier location',
    example: 'United States',
    required: true,
  })
  @IsString()
  @IsOptional()
  country!: string;

  @ApiProperty({
    description:
      'Indicates whether the supplier is currently active in the system',
    example: true,
    default: true,
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active!: boolean;
}

import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';
import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WarehousePaginator extends Paginator<WarehouseResponseDto> {}

export class GetWarehousesDto extends PaginationArgs {
  orderBy: QueryCategoriesOrderByColumn = QueryCategoriesOrderByColumn.NAME;
  sortedBy?: SortOrder;
  search?: string;
  language?: string;
}

export enum QueryCategoriesOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}

export class WarehouseResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Unique warehouse code identifier',
    example: 'SUP-001',
  })
  @Expose()
  warehouse_code!: string;

  @ApiProperty({
    description: 'Name of the warehouse',
    example: 'Main Distribution Center',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'Legal name of the warehouse company',
    example: 'Fresh Foods Distributors Inc.',
  })
  @Expose()
  company_name!: string;

  @ApiProperty({
    description: 'Full name of the primary contact person',
    example: 'John Smith',
  })
  @Expose()
  contact_person!: string;

  @ApiProperty({
    description: 'Email address for warehouse communications',
    example: 'contact@freshfoods.com',
  })
  @Expose()
  email!: string;

  @ApiProperty({
    description: 'Primary phone number (work)',
    example: '+1-555-123-4567',
  })
  @Expose()
  phone!: string;

  @ApiProperty({
    description: 'Mobile phone number for urgent communications',
    example: '+1-555-987-6543',
  })
  @Expose()
  mobile!: string;

  @ApiProperty({
    description: 'Street address, building number, and name',
    example: '123 Main Street, Suite 100',
  })
  @Expose()
  address_line_1!: string;

  @ApiProperty({
    description: 'Additional address information (floor, apartment, PO Box)',
    example: 'Floor 5, West Wing',
  })
  @Expose()
  address_line_2!: string;

  @ApiProperty({
    description: 'City of the warehouse location',
    example: 'New York',
  })
  @Expose()
  city!: string;

  @ApiProperty({
    description: 'State or province of the warehouse location',
    example: 'NY',
  })
  @Expose()
  state!: string;

  @ApiProperty({
    description: 'Postal or ZIP code of the warehouse location',
    example: '10001',
  })
  @Expose()
  postal_code!: string;

  @ApiProperty({
    description: 'Country of the warehouse location',
    example: 'United States',
  })
  @Expose()
  country!: string;

  @ApiProperty({
    description:
      'Indicates whether the warehouse is currently active in the system',
    example: true,
  })
  @Expose()
  is_active!: boolean;
}

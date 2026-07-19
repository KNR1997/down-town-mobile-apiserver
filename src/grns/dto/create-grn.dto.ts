// create-grn.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  IsPositive,
} from 'class-validator';
import { IsNull } from 'typeorm';

export class GrnItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  product_id!: number;

  @ApiProperty({
    description: 'Quantity received',
    example: 100,
    required: true,
  })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({
    description: 'Unit price of the product',
    example: 25.5,
    required: true,
  })
  @IsNumber()
  @Min(0)
  unit_price!: number;

  @ApiProperty({
    description: 'Unit price of the product',
    example: 25.5,
    required: true,
  })
  @IsNumber()
  @Min(0)
  purchase_price!: number;

  @ApiProperty({
    description: 'Unit price of the product',
    example: 25.5,
    required: true,
  })
  @IsNumber()
  @Min(0)
  selling_price!: number;

  @ApiProperty({
    description: 'Discount percentage (if any)',
    example: 5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;

  @ApiProperty({
    description: 'Tax percentage',
    example: 18,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  tax?: number;

  @ApiProperty({
    description: 'Batch/Lot number',
    example: 'BATCH-2024-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  batch_number?: string;

  @ApiProperty({
    description: 'Manufacturing date',
    example: '2024-01-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  manufacturing_date?: string;

  @ApiProperty({
    description: 'Expiry date',
    example: '2025-01-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  expiry_date?: string;
}

export class CreateGrnDto {
  // @ApiProperty({
  //   description: 'Supplier ID',
  //   example: 1,
  //   required: true,
  // })
  // @IsNumber()
  // @IsPositive()
  // supplier_id!: number;

  // @ApiProperty({
  //   description: 'Warehouse ID where goods are received',
  //   example: 1,
  //   required: true,
  // })
  // @IsNumber()
  // @IsPositive()
  // warehouse_id!: number;

    @ApiProperty({
    description: 'Purchase Order id',
    example: 1,
    required: true,
  })
  @IsNumber()
  purchase_order!: number;

  @ApiProperty({
    description: 'Supplier invoice/reference number',
    example: 'INV-2024-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  supplier_invoice_number?: string;

  @ApiProperty({
    description: 'Date of supplier invoice',
    example: '2024-01-20',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  supplier_invoice_date?: string;

  @ApiProperty({
    description: 'Date and time when goods were received',
    example: '2024-01-25T10:30:00Z',
    required: true,
  })
  @IsDateString()
  @IsOptional()
  received_at!: string;

  @ApiProperty({
    description: 'Additional remarks or notes',
    example: 'Received with priority shipping',
    required: false,
  })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty({
    description: 'ID of the person who received the goods',
    example: 5,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional() // Todo -> fix me
  received_by!: number;

  @ApiProperty({
    description: 'Purchase order reference (if applicable)',
    example: 'PO-2024-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  purchase_order_number?: string;

  @ApiProperty({
    description: 'List of items received',
    type: [GrnItemDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrnItemDto)
  items!: GrnItemDto[];
}

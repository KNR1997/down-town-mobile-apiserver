import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsPositive,
  Min,
  IsString,
  IsDateString,
} from 'class-validator';
import { PurchaseOrderItemDto } from './create-purchase-order.dto';
import { Type } from 'class-transformer';

export class UpdatePurchaseOrderItemDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  id!: number;

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
  @IsOptional()
  unit_price!: number;

  @ApiProperty({
    description: 'Unit price of the product',
    example: 25.5,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  purchase_price!: number;

  @ApiProperty({
    description: 'Unit price of the product',
    example: 25.5,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
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

export class UpdatePurchaseOrderDto {
  @ApiProperty({
    description: 'Supplier ID',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  supplier_id!: number;

  @ApiProperty({
    description: 'Warehouse ID where goods are received',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  warehouse_id!: number;

  @ApiProperty({
    description: 'Purchase Order is approved or not',
    example: 5,
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  is_approved!: boolean;

  @ApiProperty({
    description: 'Purchase Order approved by user id',
    example: 5,
    required: true,
  })
  @IsNumber()
  @IsOptional()
  approved_by!: number;

  @ApiProperty({
    description: 'List of items received',
    type: [UpdatePurchaseOrderItemDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseOrderItemDto)
  items!: UpdatePurchaseOrderItemDto[];
}

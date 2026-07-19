import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';
import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GRNStatus } from 'src/common/enums';
import { PurchaseOrderResponseDto } from 'src/purchase-orders/dto/get-purchase-order.dto';
import { ProductResponseDto } from 'src/products/dto/get-products.dto';

export class GRNPaginator extends Paginator<GRNResponseDto> {}

export class GetGRNsDto extends PaginationArgs {
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

export class GRNItemResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  product_id!: number;

  @ApiProperty({ type: ProductResponseDto })
  @Expose()
  @Type(() => ProductResponseDto)
  product!: ProductResponseDto;

  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  quantity!: number;

  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  purchase_price!: number;

  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  selling_price!: number;

  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  batch_number!: number;

  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  expiry_date!: Date;
}

export class GRNResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'GRN number',
    example: 'GRN-260719-0001',
  })
  @Expose()
  grn_number?: string;

  @ApiProperty({
    description: 'Supplier ID',
    example: 1,
  })
  @Expose()
  supplier_id!: number;

  @ApiProperty({
    description: 'Warehouse ID where goods are received',
    example: 1,
  })
  @Expose()
  warehouse_id!: number;

  @ApiProperty({
    description: 'Status of the GRN',
    example: GRNStatus.DRAFT,
  })
  @Expose()
  status!: GRNStatus;

  @ApiProperty({
    description: 'Supplier invoice/reference number',
    example: 'INV-2024-001',
  })
  @Expose()
  supplier_invoice_number?: string;

  @ApiProperty({
    description: 'Date of supplier invoice',
    example: '2024-01-20',
  })
  @Expose()
  supplier_invoice_date?: string;

  @ApiProperty({
    description: 'Date and time when goods were received',
    example: '2024-01-25T10:30:00Z',
  })
  @Expose()
  received_at!: string;

  @ApiProperty({
    description: 'Additional remarks or notes',
    example: 'Received with priority shipping',
  })
  @Expose()
  remarks!: string;

  @ApiProperty({
    description: 'ID of the person who received the goods',
    example: 5,
  })
  @Expose()
  received_by!: number;

  @ApiProperty({ type: PurchaseOrderResponseDto })
  @Expose()
  @Type(() => PurchaseOrderResponseDto)
  purchase_order?: PurchaseOrderResponseDto;

  @ApiProperty({ type: GRNItemResponseDto, isArray: true })
  @Expose()
  @Type(() => GRNItemResponseDto)
  items!: GRNItemResponseDto[];
}

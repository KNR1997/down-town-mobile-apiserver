import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';
import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GRNStatus, PurchaseOrderStatus } from 'src/common/enums';
import { SupplierResponseDto } from 'src/suppliers/dto/get-supplier.dto';
import { WarehouseResponseDto } from 'src/warehouses/dto/get-warehouse.dto';
import { ProductResponseDto } from 'src/products/dto/get-products.dto';

export class PurchaseOrderPaginator extends Paginator<PurchaseOrderResponseDto> {}

export class GetPurchaseOrdersDto extends PaginationArgs {
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

export class PurchaseOrderItemResponseDto {
  @ApiProperty({ type: ProductResponseDto })
  @Expose()
  @Type(() => ProductResponseDto)
  product!: ProductResponseDto;

  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  ordered_quantity!: number;

  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  received_quantity!: number;

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
  line_total!: number;
}

export class PurchaseOrderResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Purchase order number',
    example: 'PO-2024-001',
  })
  @Expose()
  po_number?: string;

  @ApiProperty({ type: SupplierResponseDto })
  @Expose()
  @Type(() => SupplierResponseDto)
  supplier!: SupplierResponseDto;

  @ApiProperty({ type: WarehouseResponseDto })
  @Expose()
  @Type(() => WarehouseResponseDto)
  warehouse!: WarehouseResponseDto;

  @ApiProperty({
    description: 'Status of the GRN',
    example: PurchaseOrderStatus.DRAFT,
  })
  @Expose()
  status!: PurchaseOrderStatus;

  @ApiProperty({ type: PurchaseOrderItemResponseDto, isArray: true })
  @Expose()
  @Type(() => PurchaseOrderItemResponseDto)
  items!: PurchaseOrderItemResponseDto[];
}

import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { ProductStatus, ProductType } from '../entities/product.entity';
import { Paginator } from 'src/common/dto/paginator.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TypeResponseDto } from 'src/types/dto/get-types.dto';
import { CategoryResponseDto } from 'src/categories/dto/get-categories.dto';
import { SortOrder } from 'src/common/dto/generic-conditions.dto';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Apple',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'The slug of the product',
    example: 'apple',
  })
  @Expose()
  slug!: string;

  @ApiProperty({
    description: 'The sku of the product',
    example: 'apple',
  })
  @Expose()
  sku!: string;

  @ApiProperty({
    description: 'The unit of the product',
    example: 'apple',
  })
  @Expose()
  unit!: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'apple',
  })
  @Expose()
  description!: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 'apple',
  })
  @Expose()
  price!: number;

  @ApiProperty({
    description: 'The quantity of the product',
    example: 'apple',
  })
  @Expose()
  quantity!: number;

  @ApiProperty({
    description: 'The type of the product',
    enum: ProductType,
    example: ProductType.SIMPLE,
  })
  @Expose()
  product_type!: ProductType;

  @ApiProperty({
    description: 'Product categories',
    type: [CategoryResponseDto],
  })
  @Expose()
  @Type(() => CategoryResponseDto)
  categories!: CategoryResponseDto[];

  @ApiProperty({
    description: 'The status of the product',
    enum: ProductStatus,
    example: ProductStatus.PUBLISH,
  })
  @Expose()
  status!: ProductStatus;

  @ApiProperty({ type: TypeResponseDto })
  @Expose()
  @Type(() => TypeResponseDto)
  type!: TypeResponseDto;

  @ApiProperty({
    description: 'The translated languages of the product',
    example: ['en'],
    isArray: true,
  })
  @Expose()
  translated_languages!: string[];
}

export class CreateProductResponseDto {
  @ApiProperty({ example: 'Product created successfully' })
  message!: string;

  @ApiProperty({ example: 201 })
  statusCode!: number;

  @ApiProperty({ type: ProductResponseDto })
  data!: ProductResponseDto;
}

export class UpdateProductResponseDto {
  @ApiProperty({ example: 'Product updated successfully' })
  message!: string;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ type: ProductResponseDto })
  data!: ProductResponseDto;
}

export class ProductPaginator extends Paginator<ProductResponseDto> {}

export class GetProductsDto extends PaginationArgs {
  orderBy: QueryProductsOrderByColumn = QueryProductsOrderByColumn.NAME;
  sortedBy?: SortOrder;
  searchJoin?: string;
  search?: string;
  date_range?: string;
  language?: string;
}

export enum QueryProductsOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}

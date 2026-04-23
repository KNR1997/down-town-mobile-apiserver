import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { ProductStatus, ProductType } from '../entities/product.entity';
import { Paginator } from 'src/common/dto/paginator.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Apple',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The slug of the product',
    example: 'apple',
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'The type of the product',
    enum: ProductType,
    example: ProductType.SIMPLE,
  })
  @Expose()
  product_type: ProductType;

  @ApiProperty({
    description: 'The status of the product',
    enum: ProductStatus,
    example: ProductStatus.PUBLISH,
  })
  @Expose()
  status: ProductStatus;
}

export class CreateProductResponseDto {
  @ApiProperty({ example: 'Product created successfully' })
  message: string;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ type: ProductResponseDto })
  data: ProductResponseDto;
}

export class UpdateProductResponseDto {
  @ApiProperty({ example: 'Product updated successfully' })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ type: ProductResponseDto })
  data: ProductResponseDto;
}

export class ProductPaginator extends Paginator<ProductResponseDto> {}

export class GetProductsDto extends PaginationArgs {
  orderBy?: string;
  sortedBy?: string;
  searchJoin?: string;
  search?: string;
  date_range?: string;
  language?: string;
}

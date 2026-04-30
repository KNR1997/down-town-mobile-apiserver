import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ProductStatus } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Apple',
  })
  name: string;

  @ApiProperty({
    description: 'The slug of the product',
    example: 'apple',
  })
  slug: string;

  @ApiProperty({
    description: 'The sku of the product',
    example: '1213',
  })
  sku: string;

  @ApiProperty({
    description: 'The unit of the product',
    example: '1 unit',
  })
  unit: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'some details',
  })
  description: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 120,
  })
  price: number;

  @ApiProperty({
    description: 'The quantity of the product',
    example: 25,
  })
  quantity: number;

  @ApiProperty({
    description: 'Is Product public or not',
    example: true,
  })
  public: boolean;

  @ApiProperty({
    description: 'The Type id of the product',
    example: 1,
  })
  type_id: number;

  @ApiProperty({
    description: 'The shop id of the product',
    example: 1,
  })
  shop_id: number;

  @ApiProperty({
    description: 'The status of the product',
    enum: ProductStatus,
    example: ProductStatus.PUBLISH,
  })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiProperty({
    description: 'The language of the product',
    example: 'en',
  })
  @IsString()
  language: string;
}

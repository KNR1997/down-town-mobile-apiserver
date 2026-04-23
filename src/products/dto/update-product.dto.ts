import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '../entities/product.entity';
import { IsEnum } from 'class-validator';

export class UpdateProductDto {
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
    description: 'The status of the product',
    enum: ProductStatus,
    example: ProductStatus.PUBLISH,
  })
  @IsEnum(ProductStatus)
  status: ProductStatus;
}

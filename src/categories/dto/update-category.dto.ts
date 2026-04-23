import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
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
    description: 'The icon of the product',
    example: 'fruit-icon',
  })
  icon: string;

  @ApiProperty({
    description: 'The details of the product',
    example: 'Some details',
  })
  details: string;

  @ApiProperty({
    description: 'The Type id of the Category',
    example: 1,
  })
  type_id: number;
}

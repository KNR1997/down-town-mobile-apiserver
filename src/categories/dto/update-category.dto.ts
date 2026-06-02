import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Apple',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The slug of the product',
    example: 'apple',
  })
  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty({
    description: 'The icon of the product',
    example: 'fruit-icon',
  })
  @IsString()
  icon: string;

  @ApiProperty({
    description: 'The details of the product',
    example: 'Some details',
  })
  @IsString()
  @IsOptional()
  details: string;

  @ApiProperty({
    description: 'The Type id of the Category',
    example: 1,
  })
  type_id: number;

  @ApiProperty({
    description: 'The parent id of the Category',
    example: 1,
  })
  parent: number;
}

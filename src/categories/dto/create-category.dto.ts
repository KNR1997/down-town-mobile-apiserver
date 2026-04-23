import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Grocery',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The slug of the category',
    example: 'grocery',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'The icon of the category',
    example: 'grocery',
  })
  @IsString()
  icon: string;

  @ApiProperty({
    description: 'The details of the category',
    example: 'Some descriptions here',
  })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({
    description: 'The language of the category',
    example: 'en',
  })
  @IsString()
  language: string;

  @ApiProperty({
    description: 'The Type id of the Category',
    example: 1,
  })
  type_id: number;
}

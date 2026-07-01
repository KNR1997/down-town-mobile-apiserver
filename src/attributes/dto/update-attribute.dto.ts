import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAttributeDto } from './create-attribute.dto';
import { IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAttributeValueDto } from './create-attribute-value.dto';

export class UpdateAttributeDto {
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
    description: 'Category IDs',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @Type(() => CreateAttributeValueDto)
  values: CreateAttributeValueDto[];

  // @ApiProperty({
  //   description: 'The language of the product',
  //   example: 'en',
  // })
  // @IsString()
  // language: string;
}

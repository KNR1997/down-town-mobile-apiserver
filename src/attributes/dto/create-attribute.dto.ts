import { ApiProperty, PickType } from '@nestjs/swagger';
import { Attribute } from '../entities/attribute.entity';
import { AttributeResponseDto } from './get-attribute.dto';
import { IsString } from 'class-validator';

export class CreateAttributeDto {
  @ApiProperty({
    description: 'The name of the attribute',
    example: 'Size',
  })
  name: string;

  @ApiProperty({
    description: 'The slug of the attribute',
    example: 'size',
  })
  slug?: string;

  @ApiProperty({
    description: 'The language of the attribute',
    example: 'en',
  })
  @IsString()
  language: string;
}

export class AttributeValueDto {
  id: number;
  value: string;
  meta?: string;
  language?: string;
}

export class CreateAttributeResponseDto {
  @ApiProperty({ example: 'Attribute created successfully' })
  message: string;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ type: AttributeResponseDto })
  data: AttributeResponseDto;
}

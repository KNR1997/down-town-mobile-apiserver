import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAttributeValueDto {
  @ApiProperty({
    description: 'The id of the attribute value',
    example: '1',
  })
  id: number;

  @ApiProperty({
    description: 'The meta of the attribute value',
    example: 'red',
  })
  meta: string;

  @ApiProperty({
    description: 'The value of the attribute',
    example: 'Red',
  })
  value: string;

  @ApiProperty({
    description: 'The language of the attribute',
    example: 'en',
  })
  @IsString()
  language: string;
}

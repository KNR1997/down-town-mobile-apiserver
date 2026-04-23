import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateTypeDto {
  @ApiProperty({
    description: 'The name of the type',
    example: 'Grocery',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The slug of the type',
    example: 'grocery',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'The icon of the type',
    example: 'grocery',
  })
  @IsString()
  icon: string;

  @ApiProperty({
    description: 'The language of the type',
    example: 'en',
  })
  @IsString()
  language: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({
    description: 'The name of the tag',
    example: 'Grocery',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The slug of the tag',
    example: 'grocery',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'The icon of the tag',
    example: 'grocery',
  })
  @IsString()
  icon: string;

  @ApiProperty({
    description: 'The details of the tag',
    example: 'grocery',
  })
  @IsString()
  details: string;

  @ApiProperty({
    description: 'The language of the tag',
    example: 'en',
  })
  @IsString()
  language: string;

  @ApiProperty({
    description: 'The Type id of the Tag',
    example: 1,
  })
  type_id: number;
}

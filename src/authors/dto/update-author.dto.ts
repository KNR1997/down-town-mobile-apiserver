import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAuthorDto {
  @ApiProperty({
    description: 'The name of the author',
    example: 'J.K.Amal',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The slug of the author',
    example: 'grocery',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'The quote of the author',
    example: 'quote',
  })
  @IsString()
  @IsOptional()
  quote?: string;

  @ApiProperty({
    description: 'The bio of the author',
    example: 'bio',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    description: 'The born of the author',
    example: 'grocery',
  })
  @IsString()
  @IsOptional()
  born?: string;

  @ApiProperty({
    description: 'The death of the author',
    example: 'grocery',
  })
  @IsString()
  @IsOptional()
  death?: string;

  @ApiProperty({
    description: 'The language of the author',
    example: 'en',
  })
  @IsString()
  language: string;
}

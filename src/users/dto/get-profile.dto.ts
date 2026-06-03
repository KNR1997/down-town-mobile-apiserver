import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'The bio of the profile',
    example: 'shop owner',
  })
  @Expose()
  bio: string;

  @ApiProperty({
    description: 'The contact of the profile',
    example: '+94113123888',
  })
  @Expose()
  contact: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    description: 'The bio of the profile',
    example: 'shop owner',
  })
  bio: string;

  @ApiProperty({
    description: 'The contact of the profile',
    example: '+94113123888',
  })
  contact: string;
  // social: string;
}

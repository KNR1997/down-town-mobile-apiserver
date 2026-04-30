import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty({
    description: 'The new email',
    example: 'john@gmail.com',
  })
  @IsEmail()
  email: string;
}
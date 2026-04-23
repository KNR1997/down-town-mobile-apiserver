import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateShopDto {
  @ApiProperty({
    description: 'The name of the shop',
    example: 'ABC Shop',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The slug of the shop',
    example: 'abc-shop',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'The description of the shop',
    example: 'Some descriptions here',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The owner id of the shop',
    example: 1,
  })
  owner_id: number;
}

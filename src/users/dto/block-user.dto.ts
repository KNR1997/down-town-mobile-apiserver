import { ApiProperty } from '@nestjs/swagger';

export class BlockUserDto {
  @ApiProperty({
    description: 'The id of the user',
    example: '1',
  })
  id: number;
}

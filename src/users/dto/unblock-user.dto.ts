import { ApiProperty } from '@nestjs/swagger';

export class UnBlockUserDto {
  @ApiProperty({
    description: 'The id of the user',
    example: '1',
  })
  id: number;
}

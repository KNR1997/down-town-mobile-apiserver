import { ApiProperty } from '@nestjs/swagger';

export class Paginator<T> {
  data: T[];

  @ApiProperty({
    description: 'Number of items in current page',
    example: 10,
  })
  count: number;

  @ApiProperty({ example: 1 })
  current_page: number;

  @ApiProperty({ example: 0 })
  firstItem: number;

  @ApiProperty({ example: 9 })
  lastItem: number;

  @ApiProperty({ example: 3 })
  last_page: number;

  @ApiProperty({ example: 10 })
  per_page: number;

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty()
  first_page_url: string;

  @ApiProperty()
  last_page_url: string;

  @ApiProperty({ nullable: true })
  next_page_url: string;

  @ApiProperty({ nullable: true })
  prev_page_url: string;
}

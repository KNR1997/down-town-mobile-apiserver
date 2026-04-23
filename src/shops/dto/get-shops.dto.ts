import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

import { Paginator } from 'src/common/dto/paginator.dto';
import { Shop } from '../entities/shop.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ShopPaginator extends Paginator<ShopResponseDto> {}

export class GetShopsDto extends PaginationArgs {
  orderBy?: string;
  search?: string;
  sortedBy?: string;
  is_active?: boolean;
}

export class ShopResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The name of the shop',
    example: 'ABC Shop',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The slug of the shop',
    example: 'abc-shop',
  })
  @Expose()
  slug: string;
}

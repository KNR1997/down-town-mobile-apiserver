import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';

import { Author } from '../entities/author.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthorPaginator extends Paginator<AuthorResponseDto> {}

export class AuthorResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The name of the author',
    example: 'J.K. Amala',
  })
  @Expose()
  name: string;
}

export class GetAuthorDto extends PaginationArgs {
  orderBy?: QueryAuthorsOrderByColumn;
  sortedBy?: SortOrder;
  search?: string;
  language?: string;
}

export enum QueryAuthorsOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}

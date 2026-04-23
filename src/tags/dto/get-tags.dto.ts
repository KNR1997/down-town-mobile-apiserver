import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';

import { Tag } from '../entities/tag.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TypeResponseDto } from 'src/types/dto/get-types.dto';

export class TagPaginator extends Paginator<TagResponseDto> {}

export class TagResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Apple',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The slug of the product',
    example: 'apple',
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'The icon of the product',
    example: 'fruit-icon',
  })
  @Expose()
  icon: string;

  @ApiProperty({
    description: 'The details of the product',
    example: 'Some details',
  })
  @Expose()
  details: string;

  @ApiProperty({
    description: 'The translated languages of the type',
    example: 'apple',
    isArray: true,
  })
  @Expose()
  translated_languages: string[];

  @ApiProperty({ type: TypeResponseDto })
  @Expose()
  @Type(() => TypeResponseDto)
  type: TypeResponseDto;
}

export class GetTagsDto extends PaginationArgs {
  orderBy?: QueryTagsOrderByColumn;
  sortedBy?: SortOrder;
  text?: string;
  name?: string;
  hasType?: string;
  language?: string;
  search?: string;
}

export enum QueryTagsOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}

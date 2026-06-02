import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';
import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TypeResponseDto } from 'src/types/dto/get-types.dto';

export class CategoryPaginator extends Paginator<CategoryResponseDto> {}

export class GetCategoriesDto extends PaginationArgs {
  orderBy: QueryCategoriesOrderByColumn = QueryCategoriesOrderByColumn.NAME;
  sortedBy?: SortOrder;
  search?: string;
  parent?: number | string = 'null';
  language?: string;
}

export enum QueryCategoriesOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}

export class CategoryResponseDto {
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

  @ApiProperty({ type: CategoryResponseDto })
  @Expose()
  @Type(() => CategoryResponseDto)
  parent: CategoryResponseDto;
}

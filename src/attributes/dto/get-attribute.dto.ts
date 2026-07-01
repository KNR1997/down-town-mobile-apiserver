import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

export class GetAttributeArgs {
  id?: number;
  slug?: string;
  language?: string;
}

export class AttributeValueResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Red' })
  @Expose()
  value: string;

  @ApiProperty({ example: '#ff0000' })
  @Expose()
  meta: string;

  @ApiProperty({ example: 'en' })
  @Expose()
  language: string;
}

export class AttributeResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The name of the attribute',
    example: 'Apple',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The slug of the attribute',
    example: 'apple',
  })
  @Expose()
  slug: string;

  @ApiProperty({
    type: [AttributeValueResponseDto],
  })
  @Expose()
  @Type(() => AttributeValueResponseDto)
  values: AttributeValueResponseDto[];

  @ApiProperty({
    description: 'The translated languages of the attribute',
    example: ['en'],
    isArray: true,
  })
  @Expose()
  translated_languages: string[];
}

export class GetAttributesDto extends PaginationArgs {
  orderBy: QueryAttributesOrderByColumn = QueryAttributesOrderByColumn.NAME;
  sortedBy?: SortOrder;
  searchJoin?: string;
  search?: string;
  date_range?: string;
  language?: string;
}

export enum QueryAttributesOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

export class GetTypesDto {
  //   orderBy?: QueryTypesOrderByOrderByClause[];
  text?: string;
  language?: string;
  search?: string;
}

// export class QueryTypesOrderByOrderByClause {
//   column: QueryTypesOrderByColumn;
//   order: SortOrder;
// }

export enum QueryTypesOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}

export class TypeResponseDto {
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
    description: 'The slug of the type',
    example: 'apple',
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'The icon of the type',
    example: 'apple',
  })
  @Expose()
  icon: string;

  @ApiProperty({
    description: 'The language of the type',
    example: 'apple',
  })
  @Expose()
  language: string;

  @ApiProperty({
    description: 'The translated languages of the type',
    example: 'apple',
    isArray: true,
  })
  @Expose()
  translated_languages: string[];
}

import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';
import { Manufacturer } from '../entities/manufacturer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TypeResponseDto } from 'src/types/dto/get-types.dto';

export class ManufacturerPaginator extends Paginator<Manufacturer> {}

export class GetManufacturersDto extends PaginationArgs {
  orderBy?: QueryManufacturersOrderByColumn;
  sortedBy?: SortOrder;
  search?: string;
  language?: string;
}

export enum QueryManufacturersOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}

export class ManufacturerResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The name of the manufacturer',
    example: 'Apple',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The slug of the manufacturer',
    example: 'apple',
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'The description of the manufacturer',
    example: 'Some description',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'The translated languages of the manufacturer',
    example: 'en',
    isArray: true,
  })
  @Expose()
  translated_languages: string[];

  @ApiProperty({ type: TypeResponseDto })
  @Expose()
  @Type(() => TypeResponseDto)
  type: TypeResponseDto;
}

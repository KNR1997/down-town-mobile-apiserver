import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';
import { AddressResponseDto } from 'src/users/dto/address.dto';
import { ProfileResponseDto } from 'src/users/dto/get-profile.dto';
import { PermissionType } from 'src/users/entities/user.entity';

export class CustomerResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The name of the user',
    example: 'john',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john@gmail.com',
  })
  @Expose()
  email: string;

  @ApiProperty({ type: ProfileResponseDto })
  @Expose()
  @Type(() => ProfileResponseDto)
  profile?: ProfileResponseDto;
}

export class CreateCustomerResponseDto {
  @ApiProperty({ example: 'Customer created successfully' })
  message: string;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ type: CustomerResponseDto })
  data: CustomerResponseDto;
}

export class UpdateCustomerResponseDto {
  @ApiProperty({ example: 'Customer updated successfully' })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ type: CustomerResponseDto })
  data: CustomerResponseDto;
}

export class CustomerPaginator extends Paginator<CustomerResponseDto> {}

export class GetCustomersDto extends PaginationArgs {
  orderBy: QueryProductsOrderByColumn = QueryProductsOrderByColumn.NAME;
  sortedBy?: SortOrder;
  searchJoin?: string;
  search?: string;
  language?: string;
}

export enum QueryProductsOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}

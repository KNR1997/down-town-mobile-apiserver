import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AddressResponseDto } from './address.dto';
import { ProfileResponseDto } from './get-profile.dto';
import { PermissionType } from 'src/common/enums';

export class UserPaginator extends Paginator<UserResponseDto> {}

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'The name of the user',
    example: 'john Doe',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@gmail.com',
  })
  @Expose()
  email!: string;

  @ApiProperty({
    description: 'The active status of the user',
  })
  @Expose()
  is_active!: boolean;

  @ApiProperty({
    description: 'Permissions of the user',
    enum: PermissionType,
    isArray: true,
    example: ['store_owner', 'staff'],
  })
  @Expose()
  permissions!: PermissionType[];

  @ApiProperty({
    description: 'The address of the user',
    isArray: true,
  })
  @Expose()
  @Type(() => AddressResponseDto)
  addresses!: AddressResponseDto[];

  @ApiProperty({ type: ProfileResponseDto })
  @Expose()
  @Type(() => ProfileResponseDto)
  profile?: ProfileResponseDto;
}

export class GetUsersDto extends PaginationArgs {
  orderBy: QueryUsersOrderByColumn = QueryUsersOrderByColumn.NAME;
  sortedBy?: SortOrder;
  text?: string;
  search?: string;
}

export enum QueryUsersOrderByColumn {
  NAME = 'name',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  IS_ACTIVE = 'IS_ACTIVE',
}

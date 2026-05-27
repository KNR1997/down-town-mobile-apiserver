import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersDto, UserResponseDto } from './dto/get-users.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly usersService: UsersService) {}

  @Get('list')
  async findVendorsAll(@Query() query: GetUsersDto) {
    const result = await this.usersService.getVendors(query);

    const data = plainToInstance(UserResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Vendors successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }
}

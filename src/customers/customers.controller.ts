import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetUsersDto, UserResponseDto } from 'src/users/dto/get-users.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createDto: CreateCustomerDto) {
    return this.customersService.create(createDto);
  }

  @Get()
  async findAll(@Query() query: GetUsersDto) {
    const result = await this.customersService.getCustomers(query);

    const data = plainToInstance(UserResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Customers successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }
}

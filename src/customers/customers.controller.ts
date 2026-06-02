import { PinoLogger } from 'nestjs-pino';
import { plainToInstance } from 'class-transformer';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { GetUsersDto, UserResponseDto } from 'src/users/dto/get-users.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  async create(@Body() createDto: CreateCustomerDto) {
    this.logger.debug(
      {
        name: createDto.name,
      },
      'Create customer request received',
    );
    const customer = await this.customersService.create(createDto);

    const data = plainToInstance(UserResponseDto, customer, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<UserResponseDto>({
      message: 'Customer created successfully',
      statusCode: 201,
      data,
    });
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    this.logger.debug(
      {
        customerId: Number(id),
        name: updateCustomerDto.name,
      },
      'Update customer request received',
    );

    const customer = await this.customersService.update(+id, updateCustomerDto);

    const data = plainToInstance(UserResponseDto, customer, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<UserResponseDto>({
      message: 'Customer updated successfully',
      statusCode: 200,
      data,
    });
  }
}

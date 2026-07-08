import { PinoLogger } from 'nestjs-pino';
import { plainToInstance } from 'class-transformer';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerResponseDto, GetCustomersDto } from './dto/get-customer.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly logger: PinoLogger,
  ) {}

  @ApiOperation({ summary: 'Create customer' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@Body() createDto: CreateCustomerDto) {
    this.logger.debug(
      {
        name: createDto.name,
      },
      'Create customer request received',
    );

    const customer = await this.customersService.create_v2(createDto);

    const data = plainToInstance(CustomerResponseDto, customer, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<CustomerResponseDto>({
      message: 'Customer created successfully',
      statusCode: 201,
      data,
    });
  }

  @ApiOperation({ summary: 'Get paginated customers' })
  @ApiResponse({ status: 200, description: 'Return all customers.' })
  @Get()
  async findAll(@Query() query: GetCustomersDto) {
    this.logger.debug(
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
      'Get customers request received',
    );

    const result = await this.customersService.getCustomers(query);

    const data = plainToInstance(CustomerResponseDto, result.data, {
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

  @ApiOperation({ summary: 'Get customer' })
  @ApiResponse({ status: 200, description: 'Return customer.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    this.logger.debug({ id }, 'Get customer by id request received');

    const user = await this.customersService.findOne(id);

    const data = plainToInstance(CustomerResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<CustomerResponseDto>({
      message: 'Get customer by id successful.',
      statusCode: 200,
      data,
    });
  }

  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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

    const data = plainToInstance(CustomerResponseDto, customer, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<CustomerResponseDto>({
      message: 'Customer updated successfully',
      statusCode: 200,
      data,
    });
  }
}

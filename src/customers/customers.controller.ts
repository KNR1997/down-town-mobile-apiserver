import { PinoLogger } from 'nestjs-pino';
import { plainToInstance } from 'class-transformer';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateCustomerResponseDto,
  CustomerPaginator,
  CustomerResponseDto,
  GetCustomersDto,
  UpdateCustomerResponseDto,
} from './dto/get-customer.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiOkResponse({ type: CreateCustomerResponseDto })
  @ApiConflictResponse({
    description: 'Customer with this email already exists.',
  })
  @ApiConflictResponse({
    description: 'Customer with this contact number already exists.',
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided.' })
  async create(@Body() createDto: CreateCustomerDto) {
    this.logger.debug(
      {
        name: createDto.name,
      },
      'Create customer request received',
    );

    const customer = await this.customersService.create(createDto);

    const data = plainToInstance(CustomerResponseDto, customer, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<CustomerResponseDto>({
      message: 'Customer created successfully',
      statusCode: 201,
      data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated customers' })
  @ApiOkResponse({
    description: 'List of customers retrieved successfully.',
    type: CustomerPaginator,
  })
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

  @Put(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiOkResponse({
    description: 'Customer updated successfully.',
    type: UpdateCustomerResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Customer with id not found.',
  })
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

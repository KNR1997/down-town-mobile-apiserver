import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  GetOrdersDto,
  OrderResponseDto,
} from './dto/get-order.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly logger: PinoLogger,
  ) {}

  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    this.logger.debug('Create order request received');

    const order = await this.ordersService.create(createOrderDto);

    const data = plainToInstance(OrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Order created successfully',
      statusCode: 200,
      data,
    });
  }

  @ApiOperation({ summary: 'Get paginated orders' })
  @ApiResponse({ status: 200, description: 'Return all orders.' })
  @Get()
  async getOrders(@Query() query: GetOrdersDto) {
    this.logger.debug(
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
      'Get orders request received',
    );

    const result = await this.ordersService.getOrders(query);

    const data = plainToInstance(OrderResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get orders successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }

  @ApiOperation({ summary: 'Get order by id' })
  @ApiResponse({ status: 200, description: 'Return order.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.debug({ id }, 'Get order by id request received');

    const order = await this.ordersService.findOne(+id);

    const data = plainToInstance(OrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<OrderResponseDto>({
      message: 'Get order by id successful.',
      statusCode: 200,
      data,
    });
  }

  @ApiOperation({ summary: 'Update a order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    this.logger.debug(
      {
        orderId: Number(id),
      },
      'Update order request received',
    );
    const order = await this.ordersService.update(+id, updateOrderDto);

    const data = plainToInstance(OrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<OrderResponseDto>({
      message: 'Order updated successfully',
      statusCode: 200,
      data,
    });
  }

  @ApiOperation({ summary: 'Delete a order by id' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.debug(
      {
        orderId: Number(id),
      },
      'Delete order request received',
    );

    await this.ordersService.remove(+id);

    return new SuccessResponseDto({
      message: 'Order deleted successfully',
      statusCode: 200,
      data: null,
    });
  }

  @Post('checkout/verify')
  async verify(@Body() verifyOrderDto: any) {
    const result = await this.ordersService.verify(verifyOrderDto);

    return new SuccessResponseDto({
      message: 'Order verify successfully',
      statusCode: 200,
      data: result,
    });
  }
}

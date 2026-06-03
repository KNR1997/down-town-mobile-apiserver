import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, CreateOrderResponseDto } from './dto/create-order.dto';
import { UpdateOrderDto, UpdateOrderResponseDto } from './dto/update-order.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  GetOrdersDto,
  OrderPaginator,
  OrderResponseDto,
} from './dto/get-order.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
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

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiOkResponse({ type: CreateOrderResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid data provided.' })
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

  @Get()
  @ApiOperation({ summary: 'Get paginated orders' })
  @ApiOkResponse({
    description: 'List of orders retrieved successfully.',
    type: OrderPaginator,
  })
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

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiOkResponse({
    description: 'Get order by id successful.',
    type: OrderResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order with id not found.',
  })
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

  @Put(':id')
  @ApiOperation({ summary: 'Update a order' })
  @ApiOkResponse({
    description: 'Order updated successfully.',
    type: UpdateOrderResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order with id not found.',
  })
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a order by id' })
  @ApiOkResponse({
    description: 'Order deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Order with id not found.',
  })
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

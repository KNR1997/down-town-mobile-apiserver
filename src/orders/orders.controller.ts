import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { plainToInstance } from 'class-transformer';
import { GetOrdersDto, OrderResponseDto } from './dto/get-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
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
  async getOrders(@Query() query: GetOrdersDto) {
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
  async findOne(@Param('id') id: string) {
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
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return await this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
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

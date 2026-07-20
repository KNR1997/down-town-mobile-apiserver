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
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetPurchaseOrdersDto,
  PurchaseOrderResponseDto,
} from './dto/get-purchase-order.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { plainToInstance } from 'class-transformer';
import { ApprovePurchaseOrderDto } from './dto/approve-purchase-order.dto';

@ApiTags('purchase-orders')
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @ApiOperation({ summary: 'Create purchase order' })
  @ApiResponse({
    status: 201,
    description: 'The purchase order has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchaseOrdersService.create(createPurchaseOrderDto);
  }

  @ApiOperation({ summary: 'Approve purchase order' })
  @ApiResponse({
    status: 200,
    description: 'The purchase order has been successfully approved.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/approve')
  approve(@Body() approvePurchaseOrderDto: ApprovePurchaseOrderDto) {
    return this.purchaseOrdersService.approve(
      approvePurchaseOrderDto.purchase_order_id,
      approvePurchaseOrderDto.approved_by,
    );
  }

  @ApiOperation({ summary: 'Get paginated purchase orders' })
  @ApiResponse({ status: 200, description: 'Return all purchase orders.' })
  @Get()
  async findAll(@Query() query: GetPurchaseOrdersDto) {
    const result = await this.purchaseOrdersService.findAll(query);

    const data = plainToInstance(PurchaseOrderResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get purchase orders successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }

  @ApiOperation({ summary: 'Get purchase order' })
  @ApiResponse({ status: 200, description: 'Return purchase order.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.purchaseOrdersService.findOne(id);

    const data = plainToInstance(PurchaseOrderResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<PurchaseOrderResponseDto>({
      message: 'Get purchase order by id successful.',
      statusCode: 200,
      data,
    });
  }

  @ApiOperation({ summary: 'Update purchase order' })
  @ApiResponse({
    status: 201,
    description: 'The purchase order has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePurchaseOrderDto,
  ) {
    const result = await this.purchaseOrdersService.update(+id, updateDto);

    const data = plainToInstance(PurchaseOrderResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<PurchaseOrderResponseDto>({
      message: 'Purchase Order updated successfully',
      statusCode: 200,
      data,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrdersService.remove(+id);
  }
}

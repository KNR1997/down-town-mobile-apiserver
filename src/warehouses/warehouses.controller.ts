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
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import {
  GetWarehousesDto,
  WarehouseResponseDto,
} from './dto/get-warehouse.dto';

@ApiTags('warehouses')
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @ApiOperation({ summary: 'Create warehouse' })
  @ApiResponse({
    status: 201,
    description: 'The warehouse has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesService.create(createWarehouseDto);
  }

  @ApiOperation({ summary: 'Get paginated warehouses' })
  @ApiResponse({ status: 200, description: 'Return all warehouses.' })
  @Get()
  async findAll(@Query() query: GetWarehousesDto) {
    const result = await this.warehousesService.getWarehouses(query);

    const data = plainToInstance(WarehouseResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Warehouses successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }

  @ApiOperation({ summary: 'Get warehouse' })
  @ApiResponse({ status: 200, description: 'Return warehouse.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const warehouse = await this.warehousesService.findOne(id);

    const data = plainToInstance(WarehouseResponseDto, warehouse, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<WarehouseResponseDto>({
      message: 'Get warehouse by id successful.',
      statusCode: 200,
      data,
    });
  }

  @ApiOperation({ summary: 'Update warehouse' })
  @ApiResponse({
    status: 201,
    description: 'The warehouse has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    const type = await this.warehousesService.update(+id, updateWarehouseDto);

    const data = plainToInstance(WarehouseResponseDto, type, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<WarehouseResponseDto>({
      message: 'Warehouse updated successfully',
      statusCode: 200,
      data,
    });
  }

  @ApiOperation({ summary: 'Delete warehouse' })
  @ApiResponse({
    status: 201,
    description: 'The warehouse has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.warehousesService.remove(+id);
  }
}

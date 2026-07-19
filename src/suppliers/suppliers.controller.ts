import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetSuppliersDto, SupplierResponseDto } from './dto/get-supplier.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { RoleGuard } from 'src/guards/role.guard';

@ApiTags('suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @ApiOperation({ summary: 'Create supplier' })
  @ApiResponse({
    status: 201,
    description: 'The supplier has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @ApiOperation({ summary: 'Get paginated suppliers' })
  @ApiResponse({ status: 200, description: 'Return all suppliers.' })
  @Get()
  async getSuppliers(@Query() query: GetSuppliersDto) {
    const result = await this.suppliersService.getSuppliers(query);

    const data = plainToInstance(SupplierResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Suppliers successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }

  @ApiOperation({ summary: 'Get supplier' })
  @ApiResponse({ status: 200, description: 'Return supplier.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const supplier = await this.suppliersService.getSupplier(id);

    const data = plainToInstance(SupplierResponseDto, supplier, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<SupplierResponseDto>({
      message: 'Get supplier by id successful.',
      statusCode: 200,
      data,
    });
  }

  @ApiOperation({ summary: 'Update supplier' })
  @ApiResponse({
    status: 201,
    description: 'The supplier has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    const type = await this.suppliersService.update(+id, updateSupplierDto);

    const data = plainToInstance(SupplierResponseDto, type, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<SupplierResponseDto>({
      message: 'Supplier updated successfully',
      statusCode: 200,
      data,
    });
  }

  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Delete supplier' })
  @ApiResponse({
    status: 201,
    description: 'The supplier has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }
}

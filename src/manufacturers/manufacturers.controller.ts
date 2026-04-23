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
import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { plainToInstance } from 'class-transformer';
import {
  GetManufacturersDto,
  ManufacturerPaginator,
  ManufacturerResponseDto,
} from './dto/get-manufactures.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new manufacturer' })
  @ApiOkResponse({ type: CreateManufacturerDto })
  @ApiConflictResponse({
    description: 'Manufacturer with this slug already exists.',
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided.' })
  async create(@Body() createDto: CreateManufacturerDto) {
    const manufacturer = await this.manufacturersService.create(createDto);

    const data = plainToInstance(ManufacturerResponseDto, manufacturer, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<ManufacturerResponseDto>({
      message: 'Manufacturer created successfully',
      statusCode: 201,
      data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated categories' })
  @ApiOkResponse({
    description: 'List of categories retrieved successfully.',
    type: ManufacturerPaginator,
  })
  async getManufacturers(@Query() query: GetManufacturersDto) {
    const result = await this.manufacturersService.getManufacturers(query);

    const data = plainToInstance(ManufacturerResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Manufacturers successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get manufacturer by slug' })
  @ApiOkResponse({
    description: 'Get manufacturer by slug successful.',
    type: ManufacturerResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Manufacturer with slug not found.',
  })
  async findManufacturerBySlug(@Param('slug') slug: string) {
    const manufacturer =
      await this.manufacturersService.getManufacturerBySlug(slug);

    const data = plainToInstance(ManufacturerResponseDto, manufacturer, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<ManufacturerResponseDto>({
      message: 'Get manufacturer by slug successful.',
      statusCode: 200,
      data,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Manufacturer' })
  @ApiOkResponse({
    description: 'Manufacturer updated successfully.',
    type: ManufacturerResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Manufacturer with id not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateManufacturerDto,
  ) {
    const manufacturer = await this.manufacturersService.update(+id, updateDto);

    const data = plainToInstance(ManufacturerResponseDto, manufacturer, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<ManufacturerResponseDto>({
      message: 'Manufacturer updated successfully',
      statusCode: 200,
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Manufacturer by id' })
  @ApiOkResponse({
    description: 'Manufacturer deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Manufacturer with id not found.',
  })
  async remove(@Param('id') id: string) {
    return this.manufacturersService.remove(+id);
  }
}

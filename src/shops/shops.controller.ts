import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import {
  GetShopsDto,
  ShopPaginator,
  ShopResponseDto,
} from './dto/get-shops.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new shop' })
  @ApiOkResponse({ type: CreateShopDto })
  @ApiConflictResponse({
    description: 'Shop with this slug already exists.',
  })
  async create(@Body() createShopDto: CreateShopDto, @Request() request) {
    const category = await this.shopsService.create(
      createShopDto,
      request.user,
    );

    const data = plainToInstance(ShopResponseDto, category, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<ShopResponseDto>({
      message: 'Shop created successfully',
      statusCode: 201,
      data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated shops' })
  @ApiOkResponse({
    description: 'List of shops retrieved successfully.',
    type: ShopPaginator,
  })
  async getShops(@Query() query: GetShopsDto) {
    const result = await this.shopsService.getShops(query);

    const data = plainToInstance(ShopResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Shops successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get shop by slug' })
  @ApiOkResponse({
    description: 'Get shop by slug successful.',
    type: ShopResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Shop with slug not found.',
  })
  async getShopBySlug(@Param('slug') slug: string) {
    const shop = await this.shopsService.getShopBySlug(slug);

    const data = plainToInstance(ShopResponseDto, shop, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<ShopResponseDto>({
      message: 'Get shop by slug successful.',
      statusCode: 200,
      data,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Shop' })
  @ApiOkResponse({
    description: 'Shop updated successfully.',
    type: ShopResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Shop with id not found.',
  })
  async update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    const type = await this.shopsService.update(+id, updateShopDto);

    const data = plainToInstance(ShopResponseDto, type, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<ShopResponseDto>({
      message: 'Shop updated successfully',
      statusCode: 200,
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Shop by id' })
  @ApiOkResponse({
    description: 'Shop deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Shop with id not found.',
  })
  async remove(@Param('id') id: string) {
    return await this.shopsService.remove(+id);
  }
}

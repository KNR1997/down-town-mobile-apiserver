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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateProductResponseDto,
  GetProductsDto,
  ProductPaginator,
  ProductResponseDto,
  UpdateProductResponseDto,
} from './dto/get-products.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PinoLogger } from 'nestjs-pino';

// @ApiBearerAuth()
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProductsController.name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiOkResponse({ type: CreateProductResponseDto })
  @ApiConflictResponse({
    description: 'Product with this slug already exists.',
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided.' })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    this.logger.debug(
      {
        name: createProductDto.name,
        sku: createProductDto.sku,
      },
      'Create product request received',
    );

    const product = await this.productsService.create(createProductDto);

    const data = plainToInstance(ProductResponseDto, product, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<ProductResponseDto>({
      message: 'Product created successfully',
      statusCode: 201,
      data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated products' })
  @ApiOkResponse({
    description: 'List of products retrieved successfully.',
    type: ProductPaginator,
  })
  async getProducts(@Query() query: GetProductsDto) {
    this.logger.debug(
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
      'Get products request received',
    );

    const result = await this.productsService.getProducts(query);

    const data = plainToInstance(ProductResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Products successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiOkResponse({
    description: 'Get product by slug successful.',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product with slug not found.',
  })
  async getProductBySlug(@Param('slug') slug: string) {
    this.logger.debug({ slug }, 'Get product by slug request received');

    const product = await this.productsService.getProductBySlug(slug);

    const data = plainToInstance(ProductResponseDto, product, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<ProductResponseDto>({
      message: 'Get product by slug successful.',
      statusCode: 200,
      data,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiOkResponse({
    description: 'Product updated successfully.',
    type: UpdateProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product with id not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    this.logger.debug(
      {
        productId: Number(id),
        name: updateProductDto.name,
      },
      'Update product request received',
    );

    const product = await this.productsService.update(+id, updateProductDto);

    const data = plainToInstance(ProductResponseDto, product, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<ProductResponseDto>({
      message: 'Product updated successfully',
      statusCode: 200,
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by id' })
  @ApiOkResponse({
    description: 'Product deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Product with id not found.',
  })
  async remove(@Param('id') id: string) {
    this.logger.debug(
      {
        productId: Number(id),
      },
      'Delete product request received',
    );

    await this.productsService.remove(+id);

    return new SuccessResponseDto({
      message: 'Product deleted successfully',
      statusCode: 200,
      data: null,
    });
  }
}

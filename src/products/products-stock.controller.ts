import {
  Controller,
  Get,
  Query,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetProductsDto,
  ProductPaginator,
  ProductResponseDto,
} from './dto/get-products.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PinoLogger } from 'nestjs-pino';

// @ApiBearerAuth()
@ApiTags('products-stock')
@Controller('products-stock')
export class ProductsStockController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProductsStockController.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated draft products' })
  @ApiOkResponse({
    description: 'List of low stock products retrieved successfully.',
    type: ProductPaginator,
  })
  async getDraftProducts(@Query() query: GetProductsDto) {
    this.logger.debug(
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
      'Get low stock products request received',
    );

    const result = await this.productsService.getLowStockProducts(query);

    const data = plainToInstance(ProductResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get low stock Products successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }
}

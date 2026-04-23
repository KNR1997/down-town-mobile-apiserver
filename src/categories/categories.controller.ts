import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import {
  CategoryPaginator,
  CategoryResponseDto,
  GetCategoriesDto,
} from './dto/get-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiOkResponse({ type: CreateCategoryDto })
  @ApiConflictResponse({
    description: 'Category with this slug already exists.',
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided.' })
  async createProduct(@Body() createProductDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createProductDto);

    const data = plainToInstance(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<CategoryResponseDto>({
      message: 'Category created successfully',
      statusCode: 201,
      data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated categories' })
  @ApiOkResponse({
    description: 'List of categories retrieved successfully.',
    type: CategoryPaginator,
  })
  async getCategories(@Query() query: GetCategoriesDto) {
    const result = await this.categoriesService.getCategories(query);

    const data = plainToInstance(CategoryResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Categories successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiOkResponse({
    description: 'Get category by slug successful.',
    type: CategoryResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product with slug not found.',
  })
  async getProductBySlug(@Param('slug') slug: string) {
    const category = await this.categoriesService.getCategoryBySlug(slug);

    const data = plainToInstance(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<CategoryResponseDto>({
      message: 'Get category by slug successful.',
      statusCode: 200,
      data,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Category' })
  @ApiOkResponse({
    description: 'Category updated successfully.',
    type: CategoryResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Category with id not found.',
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateCategoryDto) {
    const type = await this.categoriesService.update(+id, updateDto);

    const data = plainToInstance(CategoryResponseDto, type, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<CategoryResponseDto>({
      message: 'Category updated successfully',
      statusCode: 200,
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Category by id' })
  @ApiOkResponse({
    description: 'Category deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Category with id not found.',
  })
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(+id);
  }
}

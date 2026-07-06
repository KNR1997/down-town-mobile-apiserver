import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import {
  CategoryResponseDto,
  GetCategoriesDto,
} from './dto/get-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RoleGuard } from 'src/guards/role.guard';

// @ApiBearerAuth()
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
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

  @ApiOperation({ summary: 'Get paginated categories' })
  @ApiResponse({ status: 200, description: 'Return all categories.' })
  @Get()
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

  @ApiOperation({ summary: 'Get category' })
  @ApiResponse({ status: 200, description: 'Return category.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':slug')
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

  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':id')
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

  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(+id);
  }
}

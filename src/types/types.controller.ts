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
import { TypesService } from './types.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { GetTypesDto, TypeResponseDto } from './dto/get-types.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

@ApiTags('types')
@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new type' })
  @ApiOkResponse({ type: TypeResponseDto })
  @ApiConflictResponse({
    description: 'Product with this slug already exists.',
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided.' })
  async create(@Body() createTypeDto: CreateTypeDto) {
    const type = this.typesService.create(createTypeDto);

    const data = plainToInstance(TypeResponseDto, type, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<TypeResponseDto>({
      message: 'Type created successfully',
      statusCode: 201,
      data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all types' })
  @ApiOkResponse({
    description: 'List of types retrieved successfully.',
    type: TypeResponseDto,
    isArray: true,
  })
  async findAll(@Query() query: GetTypesDto) {
    const types = await this.typesService.findAll(query);

    const data = plainToInstance(TypeResponseDto, types, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Types successfully',
      statusCode: 200,
      data,
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get type by slug' })
  @ApiOkResponse({
    description: 'Get product by slug successful.',
    type: TypeResponseDto,
  })
  async getTypeBySlug(@Param('slug') slug: string) {
    const type = await this.typesService.getTypeBySlug(slug);

    const data = plainToInstance(TypeResponseDto, type, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<TypeResponseDto>({
      message: 'Get type by slug successful.',
      statusCode: 200,
      data,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Type' })
  @ApiOkResponse({
    description: 'Type updated successfully.',
    type: TypeResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Type with id not found.',
  })
  async update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
    const type = await this.typesService.update(+id, updateTypeDto);

    const data = plainToInstance(TypeResponseDto, type, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<TypeResponseDto>({
      message: 'Type updated successfully',
      statusCode: 200,
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Type by id' })
  @ApiOkResponse({
    description: 'Type deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Type with id not found.',
  })
  async remove(@Param('id') id: string) {
    return await this.typesService.remove(+id);
  }
}

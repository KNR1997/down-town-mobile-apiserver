import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AttributesService } from './attributes.service';
import {
  CreateAttributeDto,
  CreateAttributeResponseDto,
} from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  AttributeResponseDto,
  GetAttributesDto,
} from './dto/get-attribute.dto';

@ApiTags('attributes')
@Controller('attributes')
export class AttributesController {
  constructor(
    private readonly attributesService: AttributesService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AttributesController.name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new attribute' })
  @ApiOkResponse({ type: CreateAttributeResponseDto })
  @ApiConflictResponse({
    description: 'Attribute with this slug already exists.',
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided.' })
  async create(@Body() createAttributeDto: CreateAttributeDto) {
    this.logger.debug(
      {
        name: createAttributeDto.name,
      },
      'Create attribute request received',
    );

    const attribute = await this.attributesService.create(createAttributeDto);

    const data = plainToInstance(AttributeResponseDto, attribute, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<AttributeResponseDto>({
      message: 'Attribute created successfully',
      statusCode: 201,
      data,
    });
  }

  @Get()
  async getAttributes(@Query() query: GetAttributesDto) {
    this.logger.debug(
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
      'Get attributes request received',
    );

    const result = await this.attributesService.getAttributes(query);

    const data = plainToInstance(AttributeResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    // return data;
    return new SuccessResponseDto({
      message: 'Get Attributes successfully',
      statusCode: 200,
      data: [...data],
    });
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    this.logger.debug({ slug }, 'Get attribute by slug request received');

    const attribute = await this.attributesService.getAttributeBySlug(slug);

    const data = plainToInstance(AttributeResponseDto, attribute, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<AttributeResponseDto>({
      message: 'Get attribute by slug successful.',
      statusCode: 200,
      data,
    });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    return this.attributesService.update(+id, updateAttributeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a attribute by id' })
  @ApiOkResponse({
    description: 'Attribute deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Attribute with id not found.',
  })
  async remove(@Param('id') id: string) {
    this.logger.debug(
      {
        attributeId: Number(id),
      },
      'Delete attribute request received',
    );

    await this.attributesService.remove(+id);

    return new SuccessResponseDto({
      message: 'Attribute deleted successfully',
      statusCode: 200,
      data: null,
    });
  }
}

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
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { plainToInstance } from 'class-transformer';
import { GetTagsDto, TagPaginator, TagResponseDto } from './dto/get-tags.dto';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiOkResponse({ type: CreateTagDto })
  @ApiConflictResponse({
    description: 'Tag with this slug already exists.',
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided.' })
  async create(@Body() createTagDto: CreateTagDto) {
    const category = await this.tagsService.create(createTagDto);

    const data = plainToInstance(TagResponseDto, category, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<TagResponseDto>({
      message: 'Tag created successfully',
      statusCode: 201,
      data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated tags' })
  @ApiOkResponse({
    description: 'List of tags retrieved successfully.',
    type: TagPaginator,
  })
  async getTags(@Query() query: GetTagsDto) {
    const result = await this.tagsService.getTags(query);

    const data = plainToInstance(TagResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Tags successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get tag by slug' })
  @ApiOkResponse({
    description: 'Get tag by slug successful.',
    type: TagResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Tag with slug not found.',
  })
  async getTagBySlug(@Param('slug') slug: string) {
    const tag = await this.tagsService.getTagBySlug(slug);

    const data = plainToInstance(TagResponseDto, tag, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<TagResponseDto>({
      message: 'Get category by slug successful.',
      statusCode: 200,
      data,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a tag' })
  @ApiOkResponse({
    description: 'Tag updated successfully.',
    type: TagResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Tag with id not found.',
  })
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const type = await this.tagsService.update(+id, updateTagDto);

    const data = plainToInstance(TagResponseDto, type, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<TagResponseDto>({
      message: 'Tag updated successfully',
      statusCode: 200,
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag by id' })
  @ApiOkResponse({
    description: 'Tag deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Tag with id not found.',
  })
  async remove(@Param('id') id: string) {
    return await this.tagsService.remove(+id);
  }
}

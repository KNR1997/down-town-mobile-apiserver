import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorResponseDto, GetAuthorDto } from './dto/get-author.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    const author = await this.authorsService.create(createAuthorDto);

    const data = plainToInstance(AuthorResponseDto, author, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<AuthorResponseDto>({
      message: 'Author created successfully',
      statusCode: 201,
      data,
    });
  }

  @Get()
  async getAuthors(@Query() query: GetAuthorDto) {
    const result = await this.authorsService.getAuthors(query);

    const data = plainToInstance(AuthorResponseDto, result.data, {
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
  async getAuthorBySlug(@Param('slug') slug: string) {
    const author = await this.authorsService.getAuthorBySlug(slug);

    const data = plainToInstance(AuthorResponseDto, author, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<AuthorResponseDto>({
      message: 'Get author by slug successful.',
      statusCode: 200,
      data,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    const product = await this.authorsService.update(+id, updateAuthorDto);

    const data = plainToInstance(AuthorResponseDto, product, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<AuthorResponseDto>({
      message: 'Author updated successfully',
      statusCode: 200,
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.authorsService.remove(+id);

    return new SuccessResponseDto({
      message: 'Author deleted successfully',
      statusCode: 200,
      data: null,
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { GetAuthorDto } from './dto/get-author.dto';
import { paginate } from 'src/common/pagination/paginate';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  async create(createDto: CreateAuthorDto) {
    const author = new Author();

    const slug = slugify(createDto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    author.name = createDto.name;
    author.slug = slug;
    author.quote = createDto.quote;
    author.bio = createDto.bio;
    author.born = createDto.born;
    author.death = createDto.death;
    author.language = createDto.language;

    return await this.authorsRepository.save(author);
  }

  async getAuthors({ limit = 30, page = 1, search }: GetAuthorDto) {
    const skip = (page - 1) * limit;

    const query = this.authorsRepository.createQueryBuilder('author');

    // Optional search
    if (search) {
      query.where('author.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/authors?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async getAuthorBySlug(slug: string): Promise<Author> {
    const author = await this.authorsRepository.findOne({
      where: { slug },
    });

    if (!author) {
      throw new NotFoundException(`Author with slug "${slug}" not found`);
    }

    return author;
  }

  async update(id: number, updateDto: UpdateAuthorDto) {
    const author = await this.authorsRepository.findOneBy({ id });

    if (!author) {
      throw new NotFoundException(`Author with id "${id}" not found`);
    }

    const slug = slugify(updateDto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    author.name = updateDto.name;
    author.slug = slug;
    author.quote = updateDto.quote;
    author.bio = updateDto.bio;
    author.born = updateDto.born;
    author.death = updateDto.death;
    author.language = updateDto.language;

    return await this.authorsRepository.save(author);
  }

  async remove(id: number) {
    const author = await this.authorsRepository.findOneBy({ id });
    if (!author) {
      throw new NotFoundException(`Author with id "${id}" not found`);
    }
    await this.authorsRepository.delete(id);
  }
}

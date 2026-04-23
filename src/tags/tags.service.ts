import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { GetTagsDto } from './dto/get-tags.dto';
import { paginate } from 'src/common/pagination/paginate';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async create(createDto: CreateTagDto): Promise<Tag> {
    const tag = new Tag();

    const slug = slugify(createDto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    tag.name = createDto.name;
    tag.slug = slug;
    tag.icon = createDto.icon;
    tag.details = createDto.details;
    tag.language = createDto.language;
    tag.type = { id: createDto.type_id } as any;

    return await this.tagsRepository.save(tag);
  }

  async getTags({ limit = 30, page = 1, search }: GetTagsDto) {
    const skip = (page - 1) * limit;

    const query = this.tagsRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.type', 'type');

    // Optional search
    if (search) {
      const parseSearchParams = search.split(';');

      const allowedCategoryFields = ['name', 'slug', 'language'];
      const allowedTypeFields = ['slug', 'name'];

      for (const param of parseSearchParams) {
        const [key, value] = param.split(':');

        if (!key || !value) continue;

        const paramKey = key.replace('.', '_');

        // Category fields
        if (allowedCategoryFields.includes(key)) {
          query.andWhere(`category.${key} ILIKE :${paramKey}`, {
            [paramKey]: `%${value}%`,
          });
        }

        // Type relation fields
        if (key.startsWith('type.')) {
          const relationField = key.split('.')[1];

          if (allowedTypeFields.includes(relationField)) {
            query.andWhere(`type.${relationField} ILIKE :${paramKey}`, {
              [paramKey]: `%${value}%`,
            });
          }
        }
      }
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/products?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async getTagBySlug(slug: string): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({
      where: { slug },
      relations: ['type'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with slug "${slug}" not found`);
    }

    return tag;
  }

  async update(id: number, updateDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagsRepository.findOneBy({ id });

    if (!tag) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }

    const slug = slugify(updateDto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    tag.name = updateDto.name;
    tag.slug = slug;
    tag.icon = updateDto.icon;
    tag.details = updateDto.details;
    tag.type = { id: updateDto.type_id } as any;

    return await this.tagsRepository.save(tag);
  }

  async remove(id: number) {
    const tag = await this.tagsRepository.findOneBy({ id });
    if (!tag) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }
    await this.tagsRepository.delete(id);
  }
}

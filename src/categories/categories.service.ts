import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import slugify from 'slugify';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { paginate } from 'src/common/pagination/paginate';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    private readonly entityManager: EntityManager,
  ) { }

  async create(createDto: CreateCategoryDto): Promise<Category> {
    // Use provided slug or generate one from name
    const slug =
      createDto.slug ||
      slugify(createDto.name, {
        lower: true,
        strict: true,
        trim: true,
      });

    // Check only after slug is determined
    const exists = await this.categoriesRepository.exists({
      where: { slug },
    });

    if (exists) {
      throw new ConflictException(
        `Category with slug "${slug}" already exists`,
      );
    }

    const category = new Category();

    category.name = createDto.name;
    category.slug = slug;
    category.icon = createDto.icon;
    category.details = createDto.details;
    category.language = createDto.language;
    category.type = { id: createDto.type_id } as any;

    return await this.entityManager.save(category);
  }

  async getCategories({
    limit = 30,
    page = 1,
    search,
    parent,
  }: GetCategoriesDto) {
    const skip = (page - 1) * limit;

    const query = this.categoriesRepository
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

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
      relations: ['type'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  async update(id: number, updateDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    const slug = slugify(updateDto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    if (slug !== category.slug) {
      const exists = await this.categoriesRepository.exists({
        where: { slug },
      });

      if (exists) {
        throw new ConflictException(`Category with slug "${slug}" already exists`);
      }
    }

    category.name = updateDto.name;
    category.slug = slug;
    category.icon = updateDto.icon;
    category.details = updateDto.details;
    category.type = { id: updateDto.type_id } as any;

    return await this.entityManager.save(category);
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }
    await this.categoriesRepository.delete(id);
  }
}

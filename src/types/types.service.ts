import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTypeDto } from './dto/update-type.dto';
import { CreateTypeDto } from './dto/create-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Type } from './entities/type.entity';
import slugify from 'slugify';
import { GetTypesDto } from './dto/get-types.dto';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(Type)
    private readonly typesRepository: Repository<Type>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createTypeDto: CreateTypeDto) {
    const type = new Type();

    const slug = slugify(createTypeDto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    type.name = createTypeDto.name;
    type.slug = createTypeDto.slug ?? slug;
    type.icon = createTypeDto.icon;
    type.language = createTypeDto.language;

    await this.entityManager.save(type);
  }

  async findAll({ search }: GetTypesDto) {
    const query = this.typesRepository.createQueryBuilder('type');

    if (search) {
      const parseSearchParams = search.split(';');

      for (const param of parseSearchParams) {
        const [key, value] = param.split(':');

        if (!key || !value) continue;

        const allowedFields = ['name', 'slug', 'language'];

        // Example: type.name = :name
        if (allowedFields.includes(key)) {
          query.andWhere(`type.${key} ILIKE :${key}`, {
            [key]: `%${value}%`,
          });
        }
      }
    }

    const [data, count] = await query.getManyAndCount();

    return data;
  }

  async findOne(id: number) {
    return this.typesRepository.findOneBy({ id });
  }

  async getTypeBySlug(slug: string): Promise<Type> {
    const type = await this.typesRepository.findOne({
      where: { slug },
    });

    if (!type) {
      throw new NotFoundException(`Type with slug "${slug}" not found`);
    }

    return type;
  }

  async update(id: number, updateTypeDto: UpdateTypeDto): Promise<Type> {
    const type = await this.typesRepository.findOneBy({ id });

    if (!type) {
      throw new NotFoundException(`Type with id "${id}" not found`);
    }

    type.name = updateTypeDto.name;
    type.slug = updateTypeDto.slug;
    type.icon = updateTypeDto.icon;

    return await this.entityManager.save(type);
  }

  async remove(id: number) {
    await this.typesRepository.delete(id);
  }
}

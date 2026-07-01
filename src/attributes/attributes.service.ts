import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Attribute } from './entities/attribute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import slugify from 'slugify';
import { paginate } from 'src/common/pagination/paginate';
import { GetAttributesDto } from './dto/get-attribute.dto';
import { AttributeValue } from './entities/attribute-value.entity';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private readonly attributesRepository: Repository<Attribute>,

    @InjectRepository(AttributeValue)
    private readonly attributeValuesRepository: Repository<AttributeValue>,

    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AttributesService.name);
  }

  async create(createDto: CreateAttributeDto) {
    // Use provided slug or generate one from name
    const slug =
      createDto.slug ||
      slugify(createDto.name, {
        lower: true,
        strict: true,
        trim: true,
      });

    // Check only after slug is determined
    const exists = await this.attributesRepository.exists({
      where: { slug },
    });

    if (exists) {
      this.logger.warn(
        { slug },
        'Attribute creation failed: slug already exists',
      );
      throw new ConflictException(
        `Attribute with slug "${slug}" already exists`,
      );
    }

    const attribute = new Attribute();

    attribute.name = createDto.name;
    attribute.slug = slug;
    attribute.language = createDto.language;

    const saved = await this.attributesRepository.save(attribute);
    this.logger.info(
      { attributeId: saved.id, slug: saved.slug },
      'Attribute created',
    );
    return saved;
  }

  async getAttributes({
    limit = 30,
    page = 1,
    search,
    orderBy,
    sortedBy,
  }: GetAttributesDto) {
    const skip = (page - 1) * limit;

    const query = this.attributesRepository
      .createQueryBuilder('attribute')
      .leftJoinAndSelect('attribute.values', 'values');

    // SAFE SORTING
    const allowedOrderByFields = ['created_at', 'name', 'slug'];

    const safeOrderBy = allowedOrderByFields.includes(orderBy)
      ? orderBy
      : 'created_at';

    const safeSortedBy = sortedBy?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query.orderBy(`attribute.${safeOrderBy}`, safeSortedBy);

    // Optional search
    if (search) {
      const parseSearchParams = search.split(';');

      const allowedCategoryFields = ['name'];

      for (const param of parseSearchParams) {
        const [key, value] = param.split(':');

        if (!key || !value) continue;

        const paramKey = key.replace('.', '_');

        // Category fields
        if (allowedCategoryFields.includes(key)) {
          query.andWhere(`attribute.${key} ILIKE :${paramKey}`, {
            [paramKey]: `%${value}%`,
          });
        }
      }
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/attributes?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async getAttributeBySlug(slug: string): Promise<Attribute> {
    const attribute = await this.attributesRepository.findOne({
      where: { slug },
      relations: {
        values: true,
      },
    });

    if (!attribute) {
      this.logger.warn({ slug }, 'Attribute not found');
      throw new NotFoundException(`Attribute with slug "${slug}" not found`);
    }

    return attribute;
  }

  async update(id: number, updateDto: UpdateAttributeDto) {
    const attribute = await this.attributesRepository.findOne({
      where: { id },
      relations: {
        values: true,
      },
    });

    if (!attribute) {
      this.logger.warn(
        { attributeId: id },
        'Attribute update failed: not found',
      );
      throw new NotFoundException(`Attribute with id "${id}" not found`);
    }

    const slug = slugify(updateDto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    attribute.name = updateDto.name;
    attribute.slug = slug;

    await this.attributesRepository.save(attribute);

    if (updateDto.values?.length) {
      for (const valueDto of updateDto.values) {
        // UPDATE existing value
        if (valueDto.id) {
          const existingValue = await this.attributeValuesRepository.findOne({
            where: {
              id: valueDto.id,
              attribute: { id: attribute.id },
            },
          });

          if (existingValue) {
            existingValue.value = valueDto.value;
            existingValue.meta = valueDto.meta;
            existingValue.language = valueDto.language;

            await this.attributeValuesRepository.save(existingValue);
            continue;
          }
        }

        // CREATE new value
        const newValue = this.attributeValuesRepository.create({
          value: valueDto.value,
          meta: valueDto.meta,
          language: valueDto.language,
          attribute,
        });

        await this.attributeValuesRepository.save(newValue);
      }
    }

    const updated = await this.attributesRepository.findOne({
      where: { id: attribute.id },
      relations: {
        values: true,
      },
    });

    this.logger.info({ attributeId: id }, 'Attribute updated');

    return updated;
  }

  async remove(id: number) {
    const attribute = await this.attributesRepository.findOneBy({ id });
    if (!attribute) {
      this.logger.warn(
        { attributeId: id },
        'Attribute delete failed: not found',
      );
      throw new NotFoundException(`Attribute with id "${id}" not found`);
    }
    await this.attributesRepository.delete(id);
    this.logger.info({ attributetId: id }, 'Attribute deleted');
  }
}

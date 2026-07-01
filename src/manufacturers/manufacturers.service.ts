import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from './entities/manufacturer.entity';
import { EntityManager, Repository } from 'typeorm';
import slugify from 'slugify';
import { GetManufacturersDto } from './dto/get-manufactures.dto';
import { paginate } from 'src/common/pagination/paginate';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturersRepository: Repository<Manufacturer>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createDto: CreateManufacturerDto): Promise<Manufacturer> {
    const manufacturer = new Manufacturer();

    const slug = slugify(createDto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    manufacturer.name = createDto.name;
    manufacturer.slug = slug;
    manufacturer.description = createDto.description;
    manufacturer.language = createDto.language;
    manufacturer.type = { id: createDto.type_id } as any;

    return await this.entityManager.save(manufacturer);
  }

  async getManufacturers({
    limit = 30,
    page = 1,
    search,
  }: GetManufacturersDto) {
    const skip = (page - 1) * limit;

    const query =
      this.manufacturersRepository.createQueryBuilder('manufacturer');

    // Optional search
    if (search) {
      query.where('manufacturer.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/manufacturers?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async getManufacturerBySlug(slug: string): Promise<Manufacturer> {
    const manufacturer = await this.manufacturersRepository.findOne({
      where: { slug },
      relations: {
        type: true
      },
    });

    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with slug "${slug}" not found`);
    }

    return manufacturer;
  }

  async update(
    id: number,
    updateDto: UpdateManufacturerDto,
  ): Promise<Manufacturer> {
    const manufacturer = await this.manufacturersRepository.findOneBy({ id });

    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with id "${id}" not found`);
    }

    manufacturer.name = updateDto.name;
    manufacturer.slug = updateDto.slug;
    manufacturer.description = updateDto.description;
    manufacturer.type = { id: updateDto.type_id } as any;

    return await this.entityManager.save(manufacturer);
  }

  async remove(id: number) {
    const manufacturer = await this.manufacturersRepository.findOneBy({ id });
    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with id "${id}" not found`);
    }
    await this.manufacturersRepository.delete(id);
  }
}

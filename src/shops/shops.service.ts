import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { GetShopsDto } from './dto/get-shops.dto';
import { paginate } from 'src/common/pagination/paginate';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopsRepository: Repository<Shop>,
  ) {}

  async create(createDto: CreateShopDto, requestUser: any): Promise<Shop> {
    const shop = new Shop();

    const slug = slugify(createDto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    shop.name = createDto.name;
    shop.slug = slug;
    shop.description = createDto.description;
    shop.owner = { id: requestUser.userId } as any;

    return await this.shopsRepository.save(shop);
  }

  async getShops({ limit = 30, page = 1, search }: GetShopsDto) {
    const skip = (page - 1) * limit;

    const query = this.shopsRepository.createQueryBuilder('shop');

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/shops?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async getShopBySlug(slug: string): Promise<Shop> {
    const shop = await this.shopsRepository.findOne({
      where: { slug },
    });
    if (!shop) {
      throw new NotFoundException(`Shop with slug "${slug}" not found`);
    }
    return shop;
  }

  async update(id: number, updateDto: UpdateShopDto) {
    const shop = await this.shopsRepository.findOneBy({ id });

    if (!shop) {
      throw new NotFoundException(`Shop with id "${id}" not found`);
    }

    const slug = slugify(updateDto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    shop.name = updateDto.name;
    shop.slug = slug;
    shop.description = updateDto.description;
    shop.owner = { id: updateDto.owner_id } as any;

    return await this.shopsRepository.save(shop);
  }

  async remove(id: number) {
    const shop = await this.shopsRepository.findOneBy({ id });
    if (!shop) {
      throw new NotFoundException(`Shop with id "${id}" not found`);
    }
    await this.shopsRepository.delete(id);
  }

  async getMyShops(owner_id: number): Promise<Shop[]> {
    const shops = await this.shopsRepository.find({
      where: {
        owner: {
          id: owner_id
        }
      },
    });

    return shops;
  }
}

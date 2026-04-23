import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EntityManager, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProductsDto } from './dto/get-products.dto';
import { paginate } from 'src/common/pagination/paginate';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createDto: CreateProductDto): Promise<Product> {
    const exists = await this.productsRepository.exists({
      where: { slug: createDto.slug },
    });
    if (exists) {
      throw new ConflictException(
        `Product with slug "${createDto.slug}" already exists`,
      );
    }
    const product = new Product();

    product.name = createDto.name;
    product.slug = createDto.slug;
    product.status = createDto.status;

    return await this.entityManager.save(product);
  }

  async getProducts({ limit = 30, page = 1, search }: GetProductsDto) {
    const skip = (page - 1) * limit;

    const query = this.productsRepository.createQueryBuilder('product');

    // Optional search
    if (search) {
      query.where('product.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/products?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async findOne(id: number) {
    return this.productsRepository.findOneBy({ id });
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { slug },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    product.name = updateDto.name;
    product.slug = updateDto.slug;
    product.status = updateDto.status;

    return await this.entityManager.save(product);
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    await this.productsRepository.delete(id);
  }
}

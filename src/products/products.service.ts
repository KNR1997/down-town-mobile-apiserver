import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProductsDto } from './dto/get-products.dto';
import { paginate } from 'src/common/pagination/paginate';
import slugify from 'slugify';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProductsService.name);
  }

  async create(createDto: CreateProductDto): Promise<Product> {
    // Use provided slug or generate one from name
    const slug =
      createDto.slug ||
      slugify(createDto.name, {
        lower: true,
        strict: true,
        trim: true,
      });

    // Check only after slug is determined
    const exists = await this.productsRepository.exists({
      where: { slug },
    });

    if (exists) {
      this.logger.warn(
        { slug },
        'Product creation failed: slug already exists',
      );
      throw new ConflictException(`Product with slug "${slug}" already exists`);
    }

    const product = new Product();

    product.name = createDto.name;
    product.slug = slug;
    product.status = createDto.status;
    product.sku = createDto.sku;
    product.unit = createDto.unit;
    product.description = createDto.description;
    product.price = createDto.price;
    product.quantity = createDto.quantity;
    product.type = { id: createDto.type_id } as any;
    product.shop = { id: createDto.shop_id } as any;
    product.language = createDto.language;

    // Many-to-many categories
    product.categories =
      createDto.categories?.map((id) => ({ id }) as any) ?? [];

    const saved = await this.productsRepository.save(product);
    this.logger.info(
      { productId: saved.id, slug: saved.slug },
      'Product created',
    );
    return saved;
  }

  async getProducts({ limit = 30, page = 1, search }: GetProductsDto) {
    const skip = (page - 1) * limit;

    const query = this.productsRepository.createQueryBuilder('product');

    if (search) {
      const parseSearchParams = search.split(';');

      const allowedProductFields = ['name', 'status'];

      for (const param of parseSearchParams) {
        const [key, value] = param.split(':');

        if (!key || !value) continue;

        const paramKey = key.replace('.', '_');

        // RELATION FILTER (categories.slug)
        if (key.includes('.')) {
          const [relation, field] = key.split('.');

          if (relation === 'categories') {
            query.leftJoin('product.categories', 'categories');

            query.andWhere(`categories.${field} = :${paramKey}`, {
              [paramKey]: value,
            });
          }

          continue;
        }

        // Product fields
        if (key === 'status') {
          query.andWhere(`product.status = :${paramKey}`, {
            [paramKey]: value,
          });
        } else if (key === 'product_type') {
          query.andWhere(`product.product_type = :${paramKey}`, {
            [paramKey]: value,
          });
        } else if (allowedProductFields.includes(key)) {
          query.andWhere(`product.${key} ILIKE :${paramKey}`, {
            [paramKey]: `%${value}%`,
          });
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

  async getLowStockProducts({ limit = 30, page = 1, search }: GetProductsDto) {
    const skip = (page - 1) * limit;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .where('product.quantity < :qty', { qty: 10 });

    if (search) {
      const parseSearchParams = search.split(';');

      const allowedProductFields = ['name', 'status'];

      for (const param of parseSearchParams) {
        const [key, value] = param.split(':');

        if (!key || !value) continue;

        const paramKey = key.replace('.', '_');

        // RELATION FILTER (categories.slug)
        if (key.includes('.')) {
          const [relation, field] = key.split('.');

          if (relation === 'categories') {
            query.leftJoin('product.categories', 'categories');

            query.andWhere(`categories.${field} = :${paramKey}`, {
              [paramKey]: value,
            });
          }

          continue;
        }

        // Product fields
        if (key === 'status') {
          query.andWhere(`product.status = :${paramKey}`, {
            [paramKey]: value,
          });
        } else if (key === 'product_type') {
          query.andWhere(`product.product_type = :${paramKey}`, {
            [paramKey]: value,
          });
        } else if (allowedProductFields.includes(key)) {
          query.andWhere(`product.${key} ILIKE :${paramKey}`, {
            [paramKey]: `%${value}%`,
          });
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

  async findOne(id: number) {
    return this.productsRepository.findOneBy({ id });
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { slug },
      relations: ['type', 'categories'],
    });

    if (!product) {
      this.logger.warn({ slug }, 'Product not found');
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    return product;
  }

  async update(id: number, updateDto: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      this.logger.warn({ productId: id }, 'Product update failed: not found');
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    const slug = slugify(updateDto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    product.name = updateDto.name;
    product.slug = slug;
    product.status = updateDto.status;
    product.sku = updateDto.sku;
    product.unit = updateDto.unit;
    product.description = updateDto.description;
    product.price = updateDto.price;
    product.quantity = updateDto.quantity;
    product.type = { id: updateDto.type_id } as any;
    product.shop = { id: updateDto.shop_id } as any;
    product.language = updateDto.language;

    // Replace existing category relations
    product.categories =
      updateDto.categories?.map((id) => ({ id }) as any) ?? [];

    const updated = await this.productsRepository.save(product);
    this.logger.info({ productId: id }, 'Product updated');
    return updated;
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      this.logger.warn({ productId: id }, 'Product delete failed: not found');
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    await this.productsRepository.delete(id);
    this.logger.info({ productId: id }, 'Product deleted');
  }
}

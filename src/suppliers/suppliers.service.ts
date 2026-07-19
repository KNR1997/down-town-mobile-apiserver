import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { GetSuppliersDto } from './dto/get-supplier.dto';
import { paginate } from 'src/common/pagination/paginate';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const { supplier_code } = createSupplierDto;
    const exists = await this.suppliersRepository.exists({
      where: { supplier_code },
    });

    if (exists) {
      throw new ConflictException(
        `Supplier with supplier code "${supplier_code}" already exists`,
      );
    }

    const supplier = new Supplier();

    supplier.supplier_code = createSupplierDto.supplier_code;
    supplier.company_name = createSupplierDto.company_name;
    supplier.contact_person = createSupplierDto.contact_person;
    supplier.email = createSupplierDto.email;
    supplier.phone = createSupplierDto.phone;
    supplier.mobile = createSupplierDto.mobile;
    supplier.address_line_1 = createSupplierDto.address_line_1;
    supplier.address_line_2 = createSupplierDto.address_line_2;
    supplier.city = createSupplierDto.city;
    supplier.state = createSupplierDto.state;
    supplier.postal_code = createSupplierDto.postal_code;
    supplier.country = createSupplierDto.country;
    supplier.is_active = createSupplierDto.is_active;

    return await this.suppliersRepository.save(supplier);
  }

  async getSuppliers({
    limit = 30,
    page = 1,
    search,
    orderBy,
    sortedBy,
  }: GetSuppliersDto) {
    const skip = (page - 1) * limit;

    const query = this.suppliersRepository.createQueryBuilder('supplier');

    // SAFE SORTING
    const allowedOrderByFields = ['created_at', 'name', 'slug'];

    const safeOrderBy = allowedOrderByFields.includes(orderBy)
      ? orderBy
      : 'created_at';

    const safeSortedBy = sortedBy?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query.orderBy(`supplier.${safeOrderBy}`, safeSortedBy);

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

    const url = `/suppliers?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async getSupplier(id: number): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findOne({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with id "${id}" not found`);
    }

    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const { supplier_code } = updateSupplierDto;

    const supplier = await this.suppliersRepository.findOneBy({ id });

    if (!supplier) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    if (supplier_code !== supplier.supplier_code) {
      const exists = await this.suppliersRepository.exists({
        where: { supplier_code },
      });

      if (exists) {
        throw new ConflictException(
          `Supplier with supplier code "${supplier_code}" already exists`,
        );
      }
    }

    supplier.supplier_code = updateSupplierDto.supplier_code;
    supplier.company_name = updateSupplierDto.company_name;
    supplier.contact_person = updateSupplierDto.contact_person;
    supplier.email = updateSupplierDto.email;
    supplier.phone = updateSupplierDto.phone;
    supplier.mobile = updateSupplierDto.mobile;
    supplier.address_line_1 = updateSupplierDto.address_line_1;
    supplier.address_line_2 = updateSupplierDto.address_line_2;
    supplier.city = updateSupplierDto.city;
    supplier.state = updateSupplierDto.state;
    supplier.postal_code = updateSupplierDto.postal_code;
    supplier.country = updateSupplierDto.country;
    supplier.is_active = updateSupplierDto.is_active;

    return await this.suppliersRepository.save(supplier);
  }

  async remove(id: number) {
    const supplier = await this.suppliersRepository.findOneBy({ id });
    if (!supplier) {
      throw new NotFoundException(`Supplier with id "${id}" not found`);
    }
    await this.suppliersRepository.delete(id);
  }
}

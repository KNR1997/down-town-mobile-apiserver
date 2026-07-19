import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Repository } from 'typeorm';
import { paginate } from 'src/common/pagination/paginate';
import { GetWarehousesDto } from './dto/get-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    const { warehouse_code } = createWarehouseDto;
    const exists = await this.warehouseRepository.exists({
      where: { warehouse_code },
    });

    if (exists) {
      throw new ConflictException(
        `Warehouse with code "${warehouse_code}" already exists`,
      );
    }

    const warehouse = new Warehouse();

    warehouse.warehouse_code = createWarehouseDto.warehouse_code;
    warehouse.name = createWarehouseDto.name;
    warehouse.description = createWarehouseDto.description;
    warehouse.address_line_1 = createWarehouseDto.address_line_1;
    warehouse.address_line_2 = createWarehouseDto.address_line_2;
    warehouse.city = createWarehouseDto.city;
    warehouse.state = createWarehouseDto.state;
    warehouse.postal_code = createWarehouseDto.postal_code;
    warehouse.country = createWarehouseDto.country;
    warehouse.is_active = createWarehouseDto.is_active;

    return await this.warehouseRepository.save(warehouse);
  }

  async getWarehouses({
    limit = 30,
    page = 1,
    search,
    orderBy,
    sortedBy,
  }: GetWarehousesDto) {
    const skip = (page - 1) * limit;

    const query = this.warehouseRepository.createQueryBuilder('warehouses');

    // SAFE SORTING
    const allowedOrderByFields = ['created_at', 'name', 'slug'];

    const safeOrderBy = allowedOrderByFields.includes(orderBy)
      ? orderBy
      : 'created_at';

    const safeSortedBy = sortedBy?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query.orderBy(`warehouses.${safeOrderBy}`, safeSortedBy);

    // Optional search
    if (search) {
      const parseSearchParams = search.split(';');

      const allowedWarehouseFields = ['name'];

      for (const param of parseSearchParams) {
        const [key, value] = param.split(':');

        if (!key || !value) continue;

        const paramKey = key.replace('.', '_');

        // Warehouse fields
        if (allowedWarehouseFields.includes(key)) {
          query.andWhere(`warehouses.${key} ILIKE :${paramKey}`, {
            [paramKey]: `%${value}%`,
          });
        }
      }
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/warehouses?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async findOne(id: number) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id "${id}" not found`);
    }

    return warehouse;
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    const warehouse = await this.warehouseRepository.findOneBy({ id });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id "${id}" not found`);
    }

    warehouse.warehouse_code = updateWarehouseDto.warehouse_code;
    warehouse.name = updateWarehouseDto.name;
    warehouse.description = updateWarehouseDto.description;
    warehouse.address_line_1 = updateWarehouseDto.address_line_1;
    warehouse.address_line_2 = updateWarehouseDto.address_line_2;
    warehouse.city = updateWarehouseDto.city;
    warehouse.state = updateWarehouseDto.state;
    warehouse.postal_code = updateWarehouseDto.postal_code;
    warehouse.country = updateWarehouseDto.country;
    warehouse.is_active = updateWarehouseDto.is_active;

    return await this.warehouseRepository.save(warehouse);
  }

  async remove(id: number) {
    const warehouse = await this.warehouseRepository.findOneBy({ id });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id "${id}" not found`);
    }
    await this.warehouseRepository.delete(id);
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { paginate } from 'src/common/pagination/paginate';
import { Profile } from 'src/users/entities/profile.entity';
import { PinoLogger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { GetCustomersDto } from './dto/get-customer.dto';
import { Customer } from './entities/customer.entity';
import { PermissionType, RoleType } from 'src/common/enums';

@Injectable()
export class CustomersService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,

    private readonly logger: PinoLogger,
  ) {}

  // async create(createDto: CreateCustomerDto) {
  //   return this.dataSource.transaction(async (manager) => {
  //     const exists = await manager.exists(User, {
  //       where: { email: createDto.email },
  //     });

  //     if (exists) {
  //       this.logger.warn(
  //         { email: createDto.email },
  //         'Customer creation failed: email already exists',
  //       );
  //       throw new ConflictException(
  //         `Customer with email "${createDto.email}" already exists`,
  //       );
  //     }

  //     const existsByContact = await manager.exists(Profile, {
  //       where: { contact: createDto?.profile?.contact },
  //     });

  //     if (existsByContact) {
  //       this.logger.warn(
  //         { contact: createDto?.profile?.contact },
  //         'Customer creation failed: contact number already exists',
  //       );
  //       throw new ConflictException(
  //         `Customer with contact number "${createDto.profile?.contact}" already exists`,
  //       );
  //     }

  //     const hashedPassword = await bcrypt.hash(createDto.password, 10);

  //     const user = manager.create(User, {
  //       name: createDto.name,
  //       email: createDto.email,
  //       password: hashedPassword,
  //       role: RoleType.CUSTOMER,
  //       permissions: [PermissionType.CUSTOMER],
  //     });

  //     const createdCustomer = await manager.save(user);
  //     this.logger.info(
  //       { customerId: createdCustomer.id, email: createdCustomer.email },
  //       'Customer created',
  //     );

  //     const profile = manager.create(Profile, {
  //       user: { id: createdCustomer.id },
  //       bio: createDto?.profile?.bio,
  //       contact: createDto?.profile?.contact,
  //     });
  //     this.logger.info({ profileId: profile.id }, 'Profile created');

  //     await manager.save(profile);

  //     const customer = await manager.findOne(User, {
  //       where: { id: createdCustomer.id },
  //       relations: {
  //         profile: true,
  //       },
  //     });

  //     return customer;
  //   });
  // }

  async create_v2(createDto: CreateCustomerDto) {
    const { contact_number } = createDto;
    // Check only after slug is determined
    const exists = await this.customerRepository.exists({
      where: { contact_number: contact_number },
    });

    if (exists) {
      throw new ConflictException(
        `Customer with contact number "${contact_number}" already exists`,
      );
    }

    const customer = new Customer();

    customer.name = createDto.name;
    customer.contact_number = createDto.contact_number;
    customer.is_active = true;
    customer.role = RoleType.CUSTOMER;

    return await this.customerRepository.save(customer);
  }

  async getCustomers({
    limit = 5,
    page = 1,
    search,
    orderBy,
    sortedBy,
  }: GetCustomersDto) {
    const skip = (page - 1) * limit;

    const query = this.customerRepository.createQueryBuilder('customer');

    // SAFE SORTING
    const allowedCustomerFields = ['contact_number'];

    // const safeOrderBy = allowedOrderByFields.includes(orderBy)
    //   ? orderBy
    //   : 'created_at';

    // const safeSortedBy = sortedBy?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // query.orderBy(`user.${safeOrderBy}`, safeSortedBy);

    if (search) {
      const parseSearchParams = search.split(';');

      for (const param of parseSearchParams) {
        const [key, value] = param.split(':');

        if (!key || !value) continue;

        const paramKey = key.replace('.', '_');

        // Customer fields
        if (allowedCustomerFields.includes(key)) {
          query.andWhere(`customer.${key} ILIKE :${paramKey}`, {
            [paramKey]: `%${value}%`,
          });
        }
      }
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/customers/list?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async findOne(id: number) {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id "${id}" not found`);
    }

    return customer;
  }

  async update(id: number, updateDto: UpdateCustomerDto): Promise<Customer> {
    const { name, contact_number } = updateDto;
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    if (contact_number !== customer.contact_number) {
      const exists = await this.customerRepository.exists({
        where: { contact_number },
      });

      if (exists) {
        throw new ConflictException(
          `Customer with contact number "${contact_number}" already exists`,
        );
      }
    }

    customer.name = name;
    customer.contact_number = contact_number;

    return await this.customerRepository.save(customer);
  }
}

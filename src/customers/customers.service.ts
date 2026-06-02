import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionType, RoleType, User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetUsersDto } from 'src/users/dto/get-users.dto';
import { paginate } from 'src/common/pagination/paginate';
import { Profile } from 'src/users/entities/profile.entity';
import { PinoLogger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    private readonly logger: PinoLogger,
  ) {}

  async create(createDto: CreateCustomerDto) {
    return this.dataSource.transaction(async (manager) => {
      const exists = await manager.exists(User, {
        where: { email: createDto.email },
      });

      if (exists) {
        this.logger.warn(
          { email: createDto.email },
          'Customer creation failed: email already exists',
        );
        throw new ConflictException(
          `Customer with email "${createDto.email}" already exists`,
        );
      }

      const existsByContact = await manager.exists(Profile, {
        where: { contact: createDto?.profile?.contact },
      });

      if (existsByContact) {
        this.logger.warn(
          { contact: createDto?.profile?.contact },
          'Customer creation failed: contact number already exists',
        );
        throw new ConflictException(
          `Customer with contact number "${createDto.profile?.contact}" already exists`,
        );
      }

      const hashedPassword = await bcrypt.hash(createDto.password, 10);

      const user = manager.create(User, {
        name: createDto.name,
        email: createDto.email,
        password: hashedPassword,
        role: RoleType.CUSTOMER,
        permissions: [PermissionType.CUSTOMER],
      });

      const createdCustomer = await manager.save(user);
      this.logger.info(
        { customerId: createdCustomer.id, email: createdCustomer.email },
        'Customer created',
      );

      const profile = manager.create(Profile, {
        user: { id: createdCustomer.id },
        bio: createDto?.profile?.bio,
        contact: createDto?.profile?.contact,
      });
      this.logger.info({ profileId: profile.id }, 'Profile created');

      await manager.save(profile);

      const customer = await manager.findOne(User, {
        where: { id: createdCustomer.id },
        relations: {
          profile: true,
        },
      });

      return customer;
    });
  }

  async getCustomers({ limit = 5, page = 1, search }: GetUsersDto) {
    const skip = (page - 1) * limit;

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.role = :role', {
        role: RoleType.CUSTOMER,
      });

    if (search) {
      const parseSearchParams = search.split(';');

      const allowedUserFields = ['name'];
      const allowedProfileFields = ['contact'];

      for (const param of parseSearchParams) {
        const [key, value] = param.split(':');

        if (!key || !value) continue;

        const paramKey = key.replace('.', '_');

        // User fields
        if (allowedUserFields.includes(key)) {
          query.andWhere(`user.${key} ILIKE :${paramKey}`, {
            [paramKey]: `%${value}%`,
          });
        }

        // Profile fields
        if (allowedProfileFields.includes(key)) {
          if (allowedProfileFields.includes(key)) {
            query.andWhere(`profile.${key} ILIKE :${paramKey}`, {
              [paramKey]: `%${value}%`,
            });
          }
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

  async update(id: number, updateDto: UpdateCustomerDto): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const customer = await manager.findOne(User, {
        where: { id },
        relations: {
          profile: true,
        },
      });

      if (!customer) {
        this.logger.warn(
          { customerId: id },
          'Customer update failed: not found',
        );

        throw new NotFoundException(`Customer with id "${id}" not found`);
      }

      if (customer.profile?.contact != updateDto.profile.contact) {
        const existsByContact = await manager.exists(Profile, {
          where: { contact: updateDto?.profile?.contact },
        });

        if (existsByContact) {
          this.logger.warn(
            { contact: updateDto?.profile?.contact },
            'Customer creation failed: contact number already exists',
          );
          throw new ConflictException(
            `Customer with contact number "${updateDto.profile?.contact}" already exists`,
          );
        }
      }

      customer.name = updateDto.name;
      customer.email = updateDto.email;

      if (customer.profile) {
        // Update existing profile
        customer.profile.contact = updateDto.profile?.contact;
        customer.profile.bio = updateDto.profile?.bio;

        await manager.save(customer.profile);
      } else if (updateDto.profile) {
        // Create new profile
        const profile = manager.create(Profile, {
          user: customer,
          contact: updateDto.profile.contact,
          bio: updateDto.profile.bio,
        });

        customer.profile = await manager.save(profile);

        this.logger.info(
          { customerId: customer.id },
          'Profile created during customer update',
        );
      }

      await manager.save(customer);

      this.logger.info({ customerId: customer.id }, 'Customer updated');

      const updatedCustomer = await manager.findOne(User, {
        where: { id: customer.id },
        relations: {
          profile: true,
        },
      });

      if (!updatedCustomer) {
        throw new NotFoundException(
          `Customer with id "${customer.id}" not found`,
        );
      }

      return updatedCustomer;
    });
  }
}

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionType, RoleType, User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetUsersDto } from 'src/users/dto/get-users.dto';
import { paginate } from 'src/common/pagination/paginate';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateCustomerDto) {
    // Check existing customer by email
    const exists = await this.userRepository.exists({
      where: { email: createDto.email },
    });

    if (exists) {
      throw new ConflictException(
        `Customer with email "${createDto.email}" already exists`,
      );
    }

    const user = new User();

    user.name = createDto.name;
    user.email = createDto.email;
    user.role = RoleType.CUSTOMER;
    user.password = createDto.password;

    const createdUser = await this.userRepository.save(user);

    // const profile = new Profile();

    // profile.user = { id: createdUser.id } as any;
    // this.profileRepository.save(profile);

    return createdUser;
  }

  async getCustomers({ limit = 30, page = 1, search }: GetUsersDto) {
    const skip = (page - 1) * limit;

    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', {
        role: RoleType.CUSTOMER,
      });

    if (search) {
      query.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/customers/list?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }
}

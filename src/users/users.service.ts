import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PermissionType, RoleType, User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUsersDto } from './dto/get-users.dto';
import { paginate } from 'src/common/pagination/paginate';
import { Address } from './entities/address.entity';
import { Profile } from './entities/profile.entity';
import * as bcrypt from 'bcrypt';
import { Transactional } from '@nestjs-cls/transactional';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Address)
    private addressRepository: Repository<Address>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    private readonly logger: PinoLogger,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  @Transactional()
  async create({
    name,
    email,
    password,
    role,
    permissions,
  }: {
    name: string;
    email: string;
    password: string;
    role: RoleType;
    permissions: PermissionType[];
  }): Promise<User> {
    const user = new User();

    const hashedPassword = await bcrypt.hash(password, 10);

    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    user.role = role;
    user.permissions = permissions;

    const createdUser = await this.userRepository.save(user);
    this.logger.info(
      { customerId: createdUser.id, email: createdUser.email },
      'User created',
    );

    const profile = new Profile();

    profile.user = { id: createdUser.id } as any;
    const createdProfile = await this.profileRepository.save(profile);
    this.logger.info({ profileId: createdProfile.id }, 'Profile created');

    return createdUser;
  }

  async getUsers({ limit = 30, page = 1, search }: GetUsersDto) {
    const skip = (page - 1) * limit;

    const query = this.userRepository.createQueryBuilder('user');

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

    const url = `/products?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async getAdmins({ limit = 30, page = 1, search }: GetUsersDto) {
    const skip = (page - 1) * limit;

    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', {
        role: RoleType.SUPER_ADMIN,
      });
    // .where(':permission = ANY(user.permissions)', {
    //   permission: PermissionType.SUPER_ADMIN,
    // });

    if (search) {
      query.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/admin/list?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async getVendors({ limit = 30, page = 1, search }: GetUsersDto) {
    const skip = (page - 1) * limit;

    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', {
        role: RoleType.STORE_OWNER,
      });
    // .where(':permission = ANY(user.permissions)', {
    //   permission: PermissionType.STORE_OWNER,
    // });

    if (search) {
      query.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/vendors/list?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async getStaffs({ limit = 30, page = 1, search }: GetUsersDto) {
    const skip = (page - 1) * limit;

    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', {
        role: RoleType.STAFF,
      });
    // .where(':permission = ANY(user.permissions)', {
    //   permission: PermissionType.STAFF,
    // });

    if (search) {
      query.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/staff/list?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async createStaff(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.role = RoleType.STAFF;
    user.permissions = [PermissionType.STAFF];
    user.password = hashedPassword;

    const createdUser = await this.userRepository.save(user);

    const profile = new Profile();

    profile.user = { id: createdUser.id } as any;
    this.profileRepository.save(profile);

    return createdUser;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses', 'profile'],
    });

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    return user;
  }

  async update(id: number, updateDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses'], // important
    });

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    user.name = updateDto.name;
    user.email = updateDto.email;

    // Handle profile update/creation
    if (updateDto.profile) {
      if (user.profile) {
        // Update existing profile
        if (updateDto.profile.bio !== undefined)
          user.profile.bio = updateDto.profile.bio;
        // if (updateDto.profile.social !== undefined) user.profile.social = updateDto.profile.social;
        if (updateDto.profile.contact !== undefined)
          user.profile.contact = updateDto.profile.contact;

        await this.profileRepository.save(user.profile);
      } else {
        // Create new profile
        const profile = new Profile();
        profile.user = { id: id } as any;
        profile.bio = updateDto.profile.bio || '';
        profile.social = '';
        profile.contact = updateDto.profile.contact || '';

        await this.profileRepository.save(profile);
        user.profile = profile; // Assign to user object
      }
    }

    if (updateDto.address) {
      const updatedAddresses: Address[] = [];

      for (const addr of updateDto.address) {
        // UPDATE existing address
        if (addr.id) {
          const existing = await this.addressRepository.findOne({
            where: { id: addr.id, user: { id } }, // ensure ownership
          });

          if (!existing) {
            throw new NotFoundException(
              `Address with id "${addr.id}" not found for this user`,
            );
          }

          Object.assign(existing, addr);
          updatedAddresses.push(existing);
        } else {
          // CREATE new address
          const newAddress = this.addressRepository.create({
            ...addr,
            user,
          });

          updatedAddresses.push(newAddress);
        }
      }

      await this.addressRepository.save(updatedAddresses);
    }

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    await this.userRepository.delete(id);
  }

  async block(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      this.logger.warn({ userId: id }, 'User block failed: not found');
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    user.is_active = false;
    await this.userRepository.save(user);
    this.logger.info({ userId: id }, 'User blocked');
  }

  async unblock(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      this.logger.warn({ userId: id }, 'User unblock failed: not found');
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    user.is_active = true;
    await this.userRepository.save(user);
    this.logger.info({ userId: id }, 'User unblocked');
  }
}

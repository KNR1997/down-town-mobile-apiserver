import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUsersDto } from './dto/get-users.dto';
import { paginate } from 'src/common/pagination/paginate';
import { Address } from './entities/address.entity';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Address)
    private addressRepository: Repository<Address>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;

    const createdUser = await this.userRepository.save(user);

    const profile = new Profile();

    profile.user = { id: createdUser.id } as any;;
    this.profileRepository.save(profile);

    return createdUser;
  }

  async getUsers({ limit = 30, page = 1, search }: GetUsersDto) {
    const skip = (page - 1) * limit;

    const query = this.userRepository.createQueryBuilder('user');

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/products?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
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
}

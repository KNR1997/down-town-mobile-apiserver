import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/create-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

type AuthInput = { email: string; password: string };
type SignInData = { userId: number; name: string; email: string };
type AuthResult = {
  token: string;
  name: string;
  userId: number;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserInput: RegisterDto): Promise<User> {
    const exists = await this.usersService.findUserByEmail(
      createUserInput.email,
    );

    if (exists) {
      throw new ConflictException(
        `User with email "${createUserInput.email}" already exists`,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    return await this.usersService.create({
      name: createUserInput.name,
      email: createUserInput.email,
      password: hashedPassword,
    });
  }

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findUserByEmail(input.email);

    if (user && (await bcrypt.compare(input.password, user.password))) {
      return {
        userId: user.id,
        name: user.name,
        email: user.email,
      };
    }

    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.userId,
      name: user.name,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(tokenPayload);

    return {
      token,
      name: user.name,
      username: user.email,
      userId: user.userId,
    };
  }

  async updateEmail(userId: number, updateEmailDto: UpdateEmailDto) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with id "${userId}" not found`);
    }

    const updateUserDto = new UpdateUserDto();

    updateUserDto.name = user.name;
    updateUserDto.email = updateEmailDto.email;

    this.usersService.update(userId, updateUserDto);
  }
}

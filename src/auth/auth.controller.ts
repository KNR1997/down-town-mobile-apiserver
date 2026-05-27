import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginResponseDto,
  MeResponseDto,
  RegisterDto,
  RegisterResponseDto,
} from './dto/create-auth.dto';
import { AuthGuard } from './guards/auth.guard';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { plainToInstance } from 'class-transformer';
import { ShopsService } from 'src/shops/shops.service';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UsersService } from 'src/users/users.service';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly shopsService: ShopsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  @ApiConflictResponse({
    description: 'User with email already exists.',
  })
  async createAccount(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    const data = plainToInstance(RegisterResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'User registered successfully',
      statusCode: 201,
      data,
    });
  }

  @Post('token')
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({
    description: 'Login successfully',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.authenticate(loginDto);

    const data = plainToInstance(LoginResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Login successfully',
      statusCode: 200,
      data: {
        ...data,
        permissions: result.permissions,
        role: result.role,
      },
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Logged in user details' })
  @ApiOkResponse({
    description: 'Logged in user details retrieve successfully.',
    type: MeResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getUserInfo(@Request() request) {
    const requestUser = request.user;

    const user = await this.usersService.findOne(requestUser.userId);
    const shops = await this.shopsService.getMyShops(request.user.userId);

    const data = plainToInstance(
      MeResponseDto,
      {
        ...user,
        shops,
      },
      {
        excludeExtraneousValues: true,
      },
    );

    return new SuccessResponseDto({
      message: 'Logged in user details retrieve successfully.',
      statusCode: 200,
      data,
    });
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiOkResponse({
    description: 'Logout successfully',
  })
  async logout() {
    return new SuccessResponseDto({
      message: 'Logout successfully',
      statusCode: 200,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('update-email')
  @ApiOperation({ summary: 'Update email' })
  @ApiOkResponse({
    description: 'Email updated successfully.',
    type: MeResponseDto,
  })
  async updateEmail(
    @Request() request,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    const userId = request.user.userId;
    await this.authService.updateEmail(userId, updateEmailDto);
  }
}

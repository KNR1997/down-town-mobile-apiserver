import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserResponseDto } from './dto/update-user.dto';
import {
  GetUsersDto,
  UserPaginator,
  UserResponseDto,
} from './dto/get-users.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PermissionType, RoleType } from './entities/user.entity';
import { PinoLogger } from 'nestjs-pino';
import { BlockUserDto } from './dto/block-user.dto';
import { UnBlockUserDto } from './dto/unblock-user.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersController.name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiOkResponse({ type: CreateUserResponseDto })
  @ApiConflictResponse({
    description: 'User with this email already exists.',
  })
  @ApiConflictResponse({
    description: 'User with this contact number already exists.',
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided.' })
  async create(@Body() createDto: CreateUserDto) {
    this.logger.debug(
      {
        name: createDto.name,
      },
      'Create customer request received',
    );

    const user = await this.usersService.create({
      name: createDto.name,
      email: createDto.email,
      password: createDto.password,
      role: RoleType.STAFF,
      permissions: [PermissionType.STAFF],
    });

    const data = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<UserResponseDto>({
      message: 'User created successfully',
      statusCode: 201,
      data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated users' })
  @ApiOkResponse({
    description: 'List of users retrieved successfully.',
    type: UserPaginator,
  })
  async findAll(@Query() query: GetUsersDto) {
    this.logger.debug(
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
      'Get users request received',
    );

    const result = await this.usersService.getUsers(query);

    const data = plainToInstance(UserResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Users successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by slug' })
  @ApiOkResponse({
    description: 'Get user by id successful.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User with id not found.',
  })
  async findOne(@Param('id') id: number) {
    this.logger.debug({ id }, 'Get user by id request received');

    const user = await this.usersService.findOne(id);

    const data = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<UserResponseDto>({
      message: 'Get user by id successful.',
      statusCode: 200,
      data,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({
    description: 'User updated successfully.',
    type: UpdateUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User with id not found.',
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.debug(
      {
        userId: Number(id),
        name: updateUserDto.name,
      },
      'Update user request received',
    );

    const user = await this.usersService.update(+id, updateUserDto);

    const data = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<UserResponseDto>({
      message: 'User updated successfully',
      statusCode: 200,
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a User by id' })
  @ApiOkResponse({
    description: 'User deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User with id not found.',
  })
  async remove(@Param('id') id: string) {
    this.logger.debug(
      {
        userId: Number(id),
      },
      'Delete user request received',
    );

    await this.usersService.remove(+id);

    return new SuccessResponseDto({
      message: 'User deleted successfully',
      statusCode: 200,
      data: null,
    });
  }

  @Post('block-user')
  @ApiOperation({ summary: 'Block a User by id' })
  @ApiOkResponse({
    description: 'User blocked successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User with id not found.',
  })
  async block(@Body() blockUserDto: BlockUserDto) {
    this.logger.debug(
      {
        userId: blockUserDto.id,
      },
      'Block user request received',
    );
    await this.usersService.block(blockUserDto.id);

    return new SuccessResponseDto({
      message: 'User blocked successfully',
      statusCode: 200,
      data: null,
    });
  }

  @Post('unblock-user')
  @ApiOperation({ summary: 'UnBlock a User by id' })
  @ApiOkResponse({
    description: 'User un-blocked successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User with id not found.',
  })
  async unblock(@Body() unblockUserDto: UnBlockUserDto) {
    this.logger.debug(
      {
        userId: unblockUserDto.id,
      },
      'UnBlock user request received',
    );
    await this.usersService.unblock(unblockUserDto.id);

    return new SuccessResponseDto({
      message: 'User unblocked successfully',
      statusCode: 200,
      data: null,
    });
  }
}

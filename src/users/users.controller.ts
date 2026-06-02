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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto, UserResponseDto } from './dto/get-users.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { PermissionType, RoleType } from './entities/user.entity';
import { PinoLogger } from 'nestjs-pino';
import { BlockUserDto } from './dto/block-user.dto';
import { UnBlockUserDto } from './dto/unblock-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersController.name);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      role: RoleType.STAFF,
      permissions: [PermissionType.STAFF],
    });
  }

  @Get()
  async findAll(@Query() query: GetUsersDto) {
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
  async findOne(@Param('id') id: number) {
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
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const type = await this.usersService.update(+id, updateUserDto);

    const data = plainToInstance(UserResponseDto, type, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<UserResponseDto>({
      message: 'User updated successfully',
      statusCode: 200,
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }

  @Post('block-user')
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

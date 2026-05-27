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

@Controller('admin')
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  @Get('list')
  async findAdminAll(@Query() query: GetUsersDto) {
    const result = await this.usersService.getAdmins(query);

    const data = plainToInstance(UserResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Admins successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }
}

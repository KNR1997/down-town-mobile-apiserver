import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersDto, UserResponseDto } from './dto/get-users.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('staffs')
export class StaffsController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  async findAdminAll(@Query() query: GetUsersDto) {
    const result = await this.usersService.getStaffs(query);

    const data = plainToInstance(UserResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Staffs successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createStaff(createUserDto);
  }
}

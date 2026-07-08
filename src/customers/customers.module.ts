import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Profile } from 'src/users/entities/profile.entity';
import { Customer } from './entities/customer.entity';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [TypeOrmModule.forFeature([Customer, User, Profile])],
  exports: [CustomersService],
})
export class CustomersModule {}

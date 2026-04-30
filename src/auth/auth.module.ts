import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ShopsModule } from 'src/shops/shops.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    ShopsModule,
    JwtModule.register({
      global: true,
      secret: 'top-sexy',
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}

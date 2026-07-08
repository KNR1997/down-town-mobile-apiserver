import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { InvoicesModule } from 'src/invoices/invoices.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    InvoicesModule,
    PaymentsModule,
    UsersModule,
    ProductsModule,
    CustomersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

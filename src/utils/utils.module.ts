// utils/utils.module.ts
import { Module, Global } from '@nestjs/common';
import { NumberGenerator } from './number-generator.util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { Invoice } from '../invoices/entities/invoice.entity';

@Global() // Make it global so you don't need to import everywhere
@Module({
  imports: [TypeOrmModule.forFeature([Order, Invoice])],
  providers: [NumberGenerator],
  exports: [NumberGenerator],
})
export class UtilsModule {}

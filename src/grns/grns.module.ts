import { Module } from '@nestjs/common';
import { GrnsService } from './grns.service';
import { GrnsController } from './grns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsReceivedNote } from './entities/grn.entity';
import { GoodsReceivedItem } from './entities/grn-item.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { Warehouse } from 'src/warehouses/entities/warehouse.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { StockMovement } from 'src/stock-movements/entities/stock-movement.entity';
import { PurchaseOrder } from 'src/purchase-orders/entities/purchase-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrder,
      GoodsReceivedNote,
      GoodsReceivedItem,
      Supplier,
      Warehouse,
      Product,
      User,
      Inventory,
      StockMovement,
    ]),
  ],
  controllers: [GrnsController],
  providers: [GrnsService],
})
export class GrnsModule {}

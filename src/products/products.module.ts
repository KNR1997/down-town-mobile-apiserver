import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DraftProductsController } from './draft-products.controller';
import { ProductsStockController } from './products-stock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [
    ProductsController,
    DraftProductsController,
    ProductsStockController,
  ],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EpisodesModule } from './episodes/episodes.module';
import { TopicsModule } from './topics/topics.module';
import { TypesModule } from './types/types.module';
import { CategoriesModule } from './categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { Type } from './types/entities/type.entity';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { OrdersModule } from './orders/orders.module';
import { SettingsModule } from './settings/settings.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Manufacturer } from './manufacturers/entities/manufacturer.entity';
import { ShopsModule } from './shops/shops.module';
import { Shop } from './shops/entities/shop.entity';
import { Tag } from './tags/entities/tag.entity';
import { AuthorsModule } from './authors/authors.module';
import { Author } from './authors/entities/author.entity';
import { Profile } from './users/entities/profile.entity';
import { Address } from './users/entities/address.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { CustomersModule } from './customers/customers.module';
import { LoggerModule } from 'nestjs-pino';
import { AnalyticsModule } from './analytics/analytics.module';
import { AttributesModule } from './attributes/attributes.module';
import { Attribute } from './attributes/entities/attribute.entity';
import { AttributeValue } from './attributes/entities/attribute-value.entity';
import { InvoicesModule } from './invoices/invoices.module';
import { Invoice } from './invoices/entities/invoice.entity';
import { InvoiceItem } from './invoices/entities/invoice-item.entity';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ApiKeyMiddleware } from './middleware/api-key.middleware';
import { UsersController } from './users/users.controller';
import { CategoriesController } from './categories/categories.controller';
import { UtilsModule } from './utils/utils.module';
import { Customer } from './customers/entities/customer.entity';
import { GrnsModule } from './grns/grns.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { InventoriesModule } from './inventories/inventories.module';
import { Supplier } from './suppliers/entities/supplier.entity';
import { GoodsReceivedNote } from './grns/entities/grn.entity';
import { GoodsReceivedItem } from './grns/entities/grn-item.entity';
import { Warehouse } from './warehouses/entities/warehouse.entity';
import { Inventory } from './inventories/entities/inventory.entity';
import { StockMovement } from './stock-movements/entities/stock-movement.entity';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { PurchaseOrder } from './purchase-orders/entities/purchase-order.entity';
import { PurchaseOrderItem } from './purchase-orders/entities/purchase-order-item.entity';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
            };
          },
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                },
              }
            : undefined,
      },
    }),
    ConfigModule.forRoot(),
    UtilsModule,
    AnalyticsModule,
    AttributesModule,
    InvoicesModule,
    AuthModule,
    UsersModule,
    TypesModule,
    CategoriesModule,
    ManufacturersModule,
    ShopsModule,
    TagsModule,
    ProductsModule,
    EpisodesModule,
    TopicsModule,
    OrdersModule,
    SettingsModule,
    CommonModule,
    AuthorsModule,
    CustomersModule,
    InvoicesModule,
    PaymentsModule,
    // IMPORTANT: Use forRootAsync instead of forRoot
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres' as const,
        host: 'localhost',
        port: 5432,
        username: 'user',
        password: 'password',
        database: 'downtown-mobile',
        entities: [
          Type,
          Category,
          Manufacturer,
          Tag,
          Shop,
          Product,
          User,
          Author,
          Profile,
          Address,
          Order,
          OrderItem,
          Attribute,
          AttributeValue,
          Invoice,
          InvoiceItem,
          Payment,
          Customer,
          Warehouse,
          Inventory,
          StockMovement,
          GoodsReceivedNote,
          GoodsReceivedItem,
          Supplier,
          PurchaseOrder,
          PurchaseOrderItem,
        ],
        synchronize: true,
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    GrnsModule,
    StockMovementsModule,
    SuppliersModule,
    WarehousesModule,
    InventoriesModule,
    PurchaseOrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(ApiKeyMiddleware).forRoutes(CategoriesController);
//   }
// }

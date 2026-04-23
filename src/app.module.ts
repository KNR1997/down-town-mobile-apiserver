import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'downtown-mobile',
      entities: [Type, Category, Manufacturer, Tag, Shop, Product, User],
      synchronize: true,
    }),
    OrdersModule,
    SettingsModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

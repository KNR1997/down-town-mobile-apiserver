import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    EpisodesModule,
    TopicsModule,
    TypesModule,
    CategoriesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'downtown-mobile',
      entities: [Type, Product],
      synchronize: true,
    }),
    ProductsModule,
    UsersModule,
    TagsModule,
    OrdersModule,
    SettingsModule,
    ManufacturersModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

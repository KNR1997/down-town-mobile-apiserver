import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { GetOrdersDto } from './dto/get-order.dto';
import { paginate } from 'src/common/pagination/paginate';
import { User } from 'src/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(OrdersService.name);
  }

  async create(createOrderDto: CreateOrderDto) {
    const customer = await this.userRepository.findOne({
      where: { id: createOrderDto.customer_id },
    });

    if (!customer) {
      this.logger.warn(
        { customerId: createOrderDto.customer_id },
        'Customer assign failed: not found',
      );
      throw new NotFoundException(
        `Customer with id "${createOrderDto.customer_id}" not found`,
      );
    }

    const order = new Order();

    order.tracking_number = uuidv4();
    order.customer = { id: createOrderDto.customer_id } as any;
    order.customer_contact = createOrderDto.customer_contact;
    order.customer_name = createOrderDto.customer_name;
    order.amount = createOrderDto.amount;
    order.paid_total = createOrderDto.amount;
    order.total = createOrderDto.amount;
    order.order_status = OrderStatus.COMPLETED;
    order.payment_status = PaymentStatus.SUCCESS;

    // Create order items
    order.items = await Promise.all(
      createOrderDto.products.map(async (product) => {
        const productData = await this.productRepository.findOne({
          where: { id: product.product_id },
        });

        if (!productData) {
          this.logger.warn(
            { productId: product.product_id },
            'Product assign failed: not found',
          );
          throw new NotFoundException(
            `Product with id "${product.product_id}" not found`,
          );
        }

        const item = new OrderItem();
        item.product_id = product.product_id;
        item.product_name = productData.name;
        item.order_quantity = product.order_quantity;
        item.unit_price = productData.price;
        item.subtotal = productData.price * product.order_quantity;

        return item;
      }),
    );

    const saved = await this.orderRepository.save(order);
    this.logger.info({ orderId: saved.id }, 'Order created');
    return saved;
  }

  async getOrders({
    limit = 30,
    page = 1,
    search,
    orderBy,
    sortedBy,
  }: GetOrdersDto) {
    const skip = (page - 1) * limit;

    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer');

    // SAFE SORTING
    const allowedOrderByFields = ['created_at', 'total', 'customer_name'];

    const safeOrderBy = allowedOrderByFields.includes(orderBy)
      ? orderBy
      : 'created_at';

    const safeSortedBy = sortedBy?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query.orderBy(`order.${safeOrderBy}`, safeSortedBy);

    // SEARCH
    if (search) {
      const parseSearchParams = search.split(';');

      const allowedOrderFields = ['tracking_number'];

      for (const param of parseSearchParams) {
        const [key, value] = param.split(':');
        if (!key || !value) continue;

        const paramKey = key.replace('.', '_');

        if (allowedOrderFields.includes(key)) {
          query.andWhere(`order.${key} ILIKE :${paramKey}`, {
            [paramKey]: `%${value}%`,
          });
        }
      }
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/orders?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items'],
    });

    if (!order) {
      this.logger.warn({ orderId: id }, 'Order not found');
      throw new NotFoundException(`Order with id "${id}" not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOneBy({ id });

    if (!order) {
      this.logger.warn({ orderId: id }, 'Order update failed: not found');
      throw new NotFoundException(`Order with id "${id}" not found`);
    }

    order.order_status = updateOrderDto.order_status;

    const updated = await this.orderRepository.save(order);
    this.logger.info({ orderId: id }, 'Order updated');
    return updated;
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      this.logger.warn({ orderId: id }, 'Order delete failed: not found');
      throw new NotFoundException(`Order with id "${id}" not found`);
    }
    await this.orderRepository.delete(id);
    this.logger.info({ orderId: id }, 'Order deleted');
  }

  async verify(verifyOrderDto: any) {
    return verifyOrderDto;
  }
}

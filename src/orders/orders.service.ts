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

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = new Order();

    const customer = await this.userRepository.findOne({
      where: { id: createOrderDto.customer_id },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with id "${createOrderDto.customer_id}" not found`,
      );
    }

    order.tracking_number = uuidv4();
    order.customer = { id: createOrderDto.customer_id } as any;
    order.customer_contact = createOrderDto.customer_contact;
    order.customer_name = customer.name;
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

    return await this.orderRepository.save(order);
  }

  async getOrders({ limit = 30, page = 1, search, parent }: GetOrdersDto) {
    const skip = (page - 1) * limit;

    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer');

    // Optional search
    if (search) {
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
      throw new NotFoundException(`Order with id "${id}" not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException(`Order with id "${id}" not found`);
    }

    order.order_status = updateOrderDto.order_status;

    return await this.orderRepository.save(order);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async verify(verifyOrderDto: any) {
    return verifyOrderDto;
  }
}

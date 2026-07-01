import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { GetOrdersDto } from './dto/get-order.dto';
import { paginate } from 'src/common/pagination/paginate';
import { OrderItem } from './entities/order-item.entity';
import { PinoLogger } from 'nestjs-pino';
import { PaymentsService } from 'src/payments/payments.service';
import { InvoicesService } from 'src/invoices/invoices.service';
import { Transactional } from 'typeorm-transactional';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { NumberGenerator } from 'src/utils/number-generator.util';
import { OrderStatus, PaymentMethod, PaymentStatus } from 'src/common/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    private readonly logger: PinoLogger,

    private readonly usersService: UsersService,

    private readonly productsService: ProductsService,

    private readonly paymentsService: PaymentsService,

    private readonly invoicesService: InvoicesService,

    private numberGenerator: NumberGenerator,
  ) {
    this.logger.setContext(OrdersService.name);
  }

  /**
   * Create a new order with payment and invoice
   */
  @Transactional()
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      // Validate customer
      const customer = await this.usersService.findOne(
        createOrderDto.customer_id,
      );

      // Create Order
      const order = new Order();
      // order.tracking_number = uuidv4();
      order.tracking_number =
        await this.numberGenerator.generateDatedOrderTrackingNumber();
      order.customer = { id: createOrderDto.customer_id } as any;
      order.customer_contact = createOrderDto.customer_contact;
      order.customer_name = createOrderDto.customer_name;
      order.amount = createOrderDto.amount;
      order.paid_total = createOrderDto.amount;
      order.total = createOrderDto.amount;
      order.order_status = OrderStatus.COMPLETED;
      order.payment_status = PaymentStatus.SUCCESS; // Todo -> check this status

      // Create order items
      order.items = await Promise.all(
        createOrderDto.products.map(async (product) => {
          const productData = await this.productsService.findOne(
            product.product_id,
          );
          this.logger.debug(
            { productId: productData?.id },
            'Product fetch from database',
          );

          // Check stock availability
          if (productData.quantity < product.order_quantity) {
            throw new BadRequestException(
              `Insufficient stock for product "${productData.name}". Available: ${productData.quantity}, Requested: ${product.order_quantity}`,
            );
          }

          const item = new OrderItem();
          item.product_id = product.product_id;
          item.product_name = productData.name;
          item.order_quantity = product.order_quantity;
          item.unit_price = productData.price;
          item.subtotal = productData.price * product.order_quantity;

          // Reduce product quantity
          await this.productsService.decreaseQuantity(
            product.product_id,
            product.order_quantity,
          );

          this.logger.debug({ orderItem: item?.id }, 'Order item created');
          return item;
        }),
      );

      const savedOrder = await this.orderRepository.save(order);
      this.logger.info({ orderId: savedOrder.id }, 'Order created');

      // Create Payment
      const createPaymentDto = {
        order_id: savedOrder.id,
        amount: order.amount,
        tax_amount: order.sales_tax || 0,
        shipping_cost: order.delivery_fee || 0,
        discount_amount: order.discount || 0,
        net_amount: order.total,
        payment_method:
          createOrderDto.payment_method || PaymentMethod.CREDIT_CARD,
        payment_gateway: createOrderDto.payment_gateway,
        gateway_transaction_id: createOrderDto.gateway_transaction_id,
        status: PaymentStatus.PENDING,
        status_message: 'Payment initialized',
        customer_email: customer.email,
        customer_phone: createOrderDto.customer_contact,
      };
      const payment = await this.paymentsService.create(createPaymentDto);
      this.logger.info(
        { paymentId: payment.id, orderId: savedOrder.id },
        'Payment record created',
      );

      // Create Invoice
      const invoice = await this.invoicesService.createFromOrder(savedOrder.id);
      this.logger.info(
        { invoiceId: invoice.id, orderId: savedOrder.id },
        'Invoice created',
      );

      return savedOrder;
    } catch (error: any) {
      this.logger.error(
        { error: error.message, stack: error.stack },
        'Order creation failed',
      );
      throw error;
    }
  }

  // async create(createOrderDto: CreateOrderDto) {
  //   // Use a database transaction to ensure all operations succeed or fail together
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     // 1. Validate customer
  //     const customer = await this.userRepository.findOne({
  //       where: { id: createOrderDto.customer_id },
  //     });

  //     if (!customer) {
  //       this.logger.warn(
  //         { customerId: createOrderDto.customer_id },
  //         'Customer assign failed: not found',
  //       );
  //       throw new NotFoundException(
  //         `Customer with id "${createOrderDto.customer_id}" not found`,
  //       );
  //     }

  //     // 2. Create order
  //     const order = new Order();
  //     order.tracking_number = uuidv4();
  //     order.customer = { id: createOrderDto.customer_id } as any;
  //     order.customer_contact = createOrderDto.customer_contact;
  //     order.customer_name = createOrderDto.customer_name;
  //     order.amount = createOrderDto.amount;
  //     order.paid_total = createOrderDto.amount;
  //     order.total = createOrderDto.amount;
  //     order.order_status = OrderStatus.COMPLETED;
  //     // order.payment_status = PaymentStatus.SUCCESS; // todo -> fix PaymentStatus enums conflict

  //     // 3. Create order items
  //     order.items = await Promise.all(
  //       createOrderDto.products.map(async (product) => {
  //         const productData = await this.productRepository.findOne({
  //           where: { id: product.product_id },
  //         });
  //         this.logger.debug(
  //           { productId: productData?.id },
  //           'Product fetch from database',
  //         );

  //         if (!productData) {
  //           this.logger.warn(
  //             { productId: product.product_id },
  //             'Product assign failed: not found',
  //           );
  //           throw new NotFoundException(
  //             `Product with id "${product.product_id}" not found`,
  //           );
  //         }

  //         // Check stock availability
  //         if (productData.quantity < product.order_quantity) {
  //           throw new BadRequestException(
  //             `Insufficient stock for product "${productData.name}". Available: ${productData.quantity}, Requested: ${product.order_quantity}`,
  //           );
  //         }

  //         const item = new OrderItem();
  //         item.product_id = product.product_id;
  //         item.product_name = productData.name;
  //         item.order_quantity = product.order_quantity;
  //         item.unit_price = productData.price;
  //         item.subtotal = productData.price * product.order_quantity;

  //         // Reduce product quantity
  //         productData.quantity -= product.order_quantity;
  //         await this.productRepository.save(productData);

  //         this.logger.debug({ orderItem: item?.id }, 'Order item created');
  //         return item;
  //       }),
  //     );

  //     // 4. Save order
  //     const savedOrder = await this.orderRepository.save(order);
  //     this.logger.info({ orderId: savedOrder.id }, 'Order created');

  //     // 5. Create payment record
  //     const createPaymentDto = {
  //       order_id: savedOrder.id,
  //       amount: order.amount,
  //       tax_amount: order.sales_tax || 0,
  //       shipping_cost: order.delivery_fee || 0,
  //       discount_amount: order.discount || 0,
  //       net_amount: order.total,
  //       payment_method:
  //         createOrderDto.payment_method || PaymentMethod.CREDIT_CARD,
  //       payment_gateway: createOrderDto.payment_gateway,
  //       gateway_transaction_id: createOrderDto.gateway_transaction_id,
  //       status: PaymentStatus.PENDING,
  //       status_message: 'Payment initialized',
  //       customer_email: customer.email,
  //       customer_phone: createOrderDto.customer_contact,
  //     };

  //     const payment = await this.paymentsService.create(createPaymentDto);
  //     this.logger.info(
  //       { paymentId: payment.id, orderId: savedOrder.id },
  //       'Payment record created',
  //     );

  //     // 6. Process payment (if payment method and gateway details are provided)
  //     // let processedPayment = payment;
  //     // if (createOrderDto.process_payment !== false) {
  //     //   try {
  //     //     processedPayment = await this.paymentsService.processPayment({
  //     //       payment_id: payment.id,
  //     //       card_details: createOrderDto.card_details,
  //     //     });

  //     //     // Update order payment status based on payment result
  //     //     if (processedPayment.status === PaymentStatus.COMPLETED) {
  //     //       savedOrder.payment_status = PaymentStatus.COMPLETED;
  //     //       savedOrder.order_status = OrderStatus.COMPLETED;
  //     //     } else if (processedPayment.status === PaymentStatus.FAILED) {
  //     //       savedOrder.payment_status = PaymentStatus.FAILED;
  //     //       savedOrder.order_status = OrderStatus.FAILED;
  //     //     }

  //     //     await queryRunner.manager.save(Order, savedOrder);
  //     //   } catch (error) {
  //     //     this.logger.error(
  //     //       { error: error.message, orderId: savedOrder.id },
  //     //       'Payment processing failed',
  //     //     );
  //     //     // Payment failed but order and payment record were created
  //     //     // We continue to create invoice with ISSUED status
  //     //     throw error; // Re-throw to rollback transaction
  //     //   }
  //     // }

  //     // 7. Create invoice
  //     const invoice = await this.invoicesService.createFromOrder(
  //       savedOrder.id,
  //       // processedPayment.status === PaymentStatus.COMPLETED,
  //     );
  //     this.logger.info(
  //       { invoiceId: invoice.id, orderId: savedOrder.id },
  //       'Invoice created',
  //     );
  //     // try {
  //     //   // Use a flag to process payment with the invoice
  //     //   const invoice = await this.invoicesService.createFromOrder(
  //     //     savedOrder.id,
  //     //     // processedPayment.status === PaymentStatus.COMPLETED,
  //     //   );
  //     //   this.logger.info(
  //     //     { invoiceId: invoice.id, orderId: savedOrder.id },
  //     //     'Invoice created',
  //     //   );

  //     //   // 8. Commit transaction
  //     //   await queryRunner.commitTransaction();

  //     //   // 9. Return complete order data
  //     //   return {
  //     //     order: savedOrder,
  //     //     // payment: processedPayment,
  //     //     invoice: invoice,
  //     //   };
  //     // } catch (error: any) {
  //     //   this.logger.error(
  //     //     { error: error.message, orderId: savedOrder.id },
  //     //     'Invoice creation failed',
  //     //   );
  //     //   throw new InternalServerErrorException('Failed to create invoice');
  //     // }
  //   } catch (error) {
  //     // Rollback transaction on error
  //     await queryRunner.rollbackTransaction();
  //     // this.logger.error(
  //     //   { error: error.message, stack: error.stack },
  //     //   'Order creation failed',
  //     // );
  //     throw error;
  //   } finally {
  //     // Release query runner
  //     await queryRunner.release();
  //   }
  // }

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
      relations: {
        customer: true,
        items: true,
      },
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

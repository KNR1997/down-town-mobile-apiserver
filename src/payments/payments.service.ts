import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto, ProcessPaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { PaymentMethod, PaymentStatus } from 'src/common/enums';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(PaymentsService.name);
  }

  /**
   * Create a new payment record
   */
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      // Validate order exists
      const order = await this.orderRepository.findOne({
        where: { id: createPaymentDto.order_id },
      });

      if (!order) {
        throw new NotFoundException(
          `Order #${createPaymentDto.order_id} not found`,
        );
      }

      // Check if payment already exists for this order
      const existingPayment = await this.paymentRepository.findOne({
        where: { order_id: createPaymentDto.order_id },
      });

      if (existingPayment) {
        throw new BadRequestException(
          'A payment already exists for this order',
        );
      }
      // Generate invoice ID
      const invoiceId = this.generateInvoiceId();

      // Create payment entity
      const payment = new Payment();

      payment.order = order;
      payment.order_id = order.id;
      // payment.transaction_id = "TR3242422252";
      payment.amount = createPaymentDto.amount;
      payment.net_amount = createPaymentDto.net_amount;
      payment.payment_method = PaymentMethod.BANK_TRANSFER;
      payment.status = PaymentStatus.PENDING;
      payment.currency = "LKR";

      // const payment = this.paymentRepository.create({
      //   ...createPaymentDto,
      //   invoice_id: invoiceId,
      //   status: PaymentStatus.PENDING,
      //   order,
      //   payment_method: PaymentMethod.CASH,
      //   net_amount: createPaymentDto.net_amount || createPaymentDto.amount,
      // });

      const savedPayment = await this.paymentRepository.save(payment);

      // Emit payment created event
      // this.eventEmitter.emit('payment.created', {
      //   payment: savedPayment,
      //   order,
      // });

      this.logger.info(
        `Payment created for order #${order.id} with invoice #${invoiceId}`,
      );

      return savedPayment;
    } catch (error: any) {
      this.logger.error(
        `Failed to create payment: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Generate unique invoice ID
   */
  private generateInvoiceId(): string {
    const prefix = 'INV';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  async processPayment(processPaymentDto: ProcessPaymentDto) {
    // Implementation from previous response
    // ...
  }
}

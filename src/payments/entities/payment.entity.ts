import { CoreEntity } from 'src/common/entities/core.entity';
import { PaymentMethod, PaymentStatus } from 'src/common/enums';
import { PaymentGateway } from 'src/common/enums/payment-gateway.enum';
import { Order } from 'src/orders/entities/order.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Payment extends CoreEntity {
  // ====== ORDER RELATIONSHIP ======
  @Column()
  order_id!: number;

  @ManyToOne(() => Order, (order) => order.payments)
  order!: Order;

  // ====== BASIC PAYMENT INFO ======
  // @Column({ unique: true })
  // transaction_id: string; // Unique transaction ID from gateway

  @Column({ nullable: true })
  invoice_id!: string; // Invoice number (can be generated or from gateway)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax_amount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shipping_cost!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_amount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  net_amount!: number; // Total after all adjustments

  @Column()
  currency!: string; // ISO currency code (USD, EUR, etc.)

  // ====== PAYMENT METHOD & GATEWAY ======
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CREDIT_CARD,
  })
  payment_method!: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentGateway,
    nullable: true,
  })
  payment_gateway!: PaymentGateway;

  @Column({ nullable: true })
  gateway_transaction_id!: string; // Gateway's reference ID

  // ====== PAYMENT STATUS ======
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  @Column({ nullable: true })
  status_message!: string; // Detailed status message

  @Column({ nullable: true })
  failure_reason!: string; // If payment failed

  // ====== TIMESTAMPS ======
  @Column({ nullable: true })
  paid_at!: Date; // When payment was successfully completed

  @Column({ nullable: true })
  authorized_at!: Date; // When payment was authorized (for auth-only flows)

  @Column({ nullable: true })
  refunded_at!: Date; // When refund was processed

  // ====== CUSTOMER INFO ======
  @Column({ nullable: true })
  customer_email!: string;

  @Column({ nullable: true })
  customer_phone!: string;

  @Column({ nullable: true })
  billing_address!: string;

  // ====== CARD/Payment Method Details (partial, masked) ======
  @Column({ nullable: true })
  card_last_four!: string; // Only last 4 digits for security

  @Column({ nullable: true })
  card_brand!: string; // Visa, Mastercard, Amex, etc.

  @Column({ nullable: true })
  card_expiry_month!: string;

  @Column({ nullable: true })
  card_expiry_year!: string;

  // ====== RECEIPT & INVOICE ======
  @Column({ nullable: true })
  receipt_url!: string; // URL to downloadable receipt

  @Column({ nullable: true })
  invoice_pdf_url!: string; // URL to invoice PDF

  // ====== META DATA ======
  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, any>; // Flexible field for gateway-specific data

  @Column({ type: 'json', nullable: true })
  gateway_response!: Record<string, any>; // Raw response from payment gateway

  // ====== REFUND INFO ======
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refunded_amount!: number;

  @Column({ nullable: true })
  refund_transaction_id!: string;

  @Column({ nullable: true })
  refund_reason!: string;

  // ====== INSTALLMENT/SUBSCRIPTION ======
  @Column({ default: false })
  is_installment!: boolean;

  @Column({ nullable: true })
  installment_count!: number; // For installment payments

  @Column({ nullable: true })
  subscription_id!: string; // For recurring payments

  // ====== FRAUD & RISK ======
  @Column({ nullable: true })
  risk_score!: number; // 0-100 scale

  @Column({ nullable: true })
  fraud_check_status!: string;

  // ====== WEBHOOK/EVENT ======
  @Column({ nullable: true })
  webhook_received_at!: Date; // When webhook was received

  @Column({ nullable: true })
  webhook_signature!: string; // For webhook verification
}

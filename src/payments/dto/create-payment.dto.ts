import { PaymentMethod, PaymentStatus } from "src/common/enums";
import { PaymentGateway } from "src/common/enums/payment-gateway.enum";
import { CardDetails } from "src/orders/dto/create-order.dto";

export class CreatePaymentDto {
  order_id!: number;
  amount!: number;
  tax_amount!: number;
  shipping_cost!: number;
  discount_amount!: number;
  net_amount!: number;
  payment_method!: PaymentMethod;
  payment_gateway!: PaymentGateway;
  card_details!: CardDetails | null;
  gateway_transaction_id!: string;
  status!: PaymentStatus;
  status_message!: string;
}

export class ProcessPaymentDto {}

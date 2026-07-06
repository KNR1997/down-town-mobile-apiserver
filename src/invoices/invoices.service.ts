import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Order } from 'src/orders/entities/order.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { InvoiceItem } from './entities/invoice-item.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { NumberGenerator } from 'src/utils/number-generator.util';
import { InvoiceStatus, PaymentStatus } from 'src/common/enums';
// import * as puppeteer from 'puppeteer';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,

    @InjectRepository(InvoiceItem)
    private readonly invoiceItemsRepository: Repository<InvoiceItem>,

    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    private readonly logger: PinoLogger,

    private numberGenerator: NumberGenerator,
  ) {
    this.logger.setContext(InvoicesService.name);
  }

  // private async generateInvoiceNumber(): Promise<string> {
  //   const year = new Date().getFullYear();

  //   const latestInvoice = await this.invoicesRepository
  //     .createQueryBuilder('invoice')
  //     .where('invoice.invoice_number LIKE :prefix', {
  //       prefix: `INV-${year}-%`,
  //     })
  //     .orderBy('invoice.id', 'DESC')
  //     .getOne();

  //   let nextSequence = 1;

  //   if (latestInvoice) {
  //     const parts = latestInvoice.invoice_number.split('-');
  //     nextSequence = Number(parts[2]) + 1;
  //   }

  //   return `INV-${year}-${String(nextSequence).padStart(6, '0')}`;
  // }

  async createFromOrder(orderId: number): Promise<Invoice> {
    try {
      const order = await this.ordersRepository.findOne({
        where: { id: orderId },
        relations: {
          items: true,
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with id "${orderId}" not found`);
      }

      const existingInvoice = await this.invoicesRepository.findOne({
        where: {
          order: { id: orderId },
        },
      });

      if (existingInvoice) {
        throw new ConflictException(
          `Invoice already exists for order "${orderId}"`,
        );
      }

      const invoice = new Invoice();
      invoice.invoice_number =
        await this.numberGenerator.generateInvoiceNumber();
      invoice.order = order;
      invoice.subtotal = Number(order.amount);
      invoice.tax = Number(order.sales_tax);
      invoice.discount = Number(order.discount);
      invoice.shipping_fee = Number(order.delivery_fee);
      invoice.total = Number(order.total);
      invoice.status =
        order.payment_status === PaymentStatus.SUCCESS
          ? InvoiceStatus.PAID
          : InvoiceStatus.ISSUED;
      invoice.issued_at = new Date();

      if (order.payment_status === PaymentStatus.SUCCESS) {
        invoice.paid_at = new Date();
      }

      const savedInvoice = await this.invoicesRepository.save(invoice);

      // Create InvoiceItems from OrderItems
      if (order.items && order.items.length > 0) {
        const invoiceItems = order.items.map((orderItem: OrderItem) => {
          const invoiceItem = new InvoiceItem();
          invoiceItem.invoice_id = savedInvoice.id;
          invoiceItem.order_item_id = orderItem.id;
          invoiceItem.quantity = orderItem.order_quantity;
          invoiceItem.unit_price = orderItem.unit_price;
          invoiceItem.subtotal = orderItem.subtotal;
          invoiceItem.invoice = savedInvoice;
          return invoiceItem;
        });

        // Save all invoice items
        await this.invoiceItemsRepository.save(invoiceItems);

        this.logger.info(
          {
            invoiceId: savedInvoice.id,
            orderId,
            itemsCount: invoiceItems.length,
          },
          'Invoice items created',
        );
      } else {
        this.logger.warn(
          { invoiceId: savedInvoice.id, orderId },
          'No order items found for invoice',
        );
      }

      this.logger.info(
        { invoiceId: savedInvoice.id, orderId },
        'Invoice created',
      );

      return savedInvoice;
    } catch (error: any) {
      this.logger.error(
        `Failed to create invoice: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOneWithItems(id: number): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id },
      relations: {
        items: true,
        order: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with id "${id}" not found`);
    }

    return invoice;
  }

  // async getInvoice(id: number): Promise<Invoice> {}

  // async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice> {}

  // async getInvoices(dto: GetInvoicesDto) {}

  // async issueInvoice(id: number): Promise<Invoice> {}

  // async markAsPaid(id: number): Promise<Invoice> {}

  // async voidInvoice(id: number): Promise<Invoice> {}

  private compileInvoiceTemplate(data: any): string {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'invoices',
      'templates',
      'invoice.hbs',
    );

    const source = fs.readFileSync(templatePath, 'utf8');

    const template = Handlebars.compile(source);

    return template(data);
  }

  // async generatePdf(invoiceId: number): Promise<Buffer> {
  //   const invoice = await this.invoicesRepository.findOne({
  //     where: { id: invoiceId },
  //     relations: {
  //       order: {
  //         items: true,
  //       },
  //     },
  //   });

  //   if (!invoice) {
  //     throw new NotFoundException('Invoice not found');
  //   }

  //   const html = this.compileInvoiceTemplate({
  //     invoice,
  //     order: invoice.order,
  //     items: invoice.order.items,
  //   });

  //   const browser = await puppeteer.launch({
  //     headless: true,
  //   });

  //   try {
  //     const page = await browser.newPage();

  //     await page.setContent(html, {
  //       waitUntil: 'load',
  //     });

  //     const pdf = await page.pdf({
  //       format: 'A4',
  //       printBackground: true,
  //     });

  //     return Buffer.from(pdf);
  //   } finally {
  //     await browser.close();
  //   }
  // }
}

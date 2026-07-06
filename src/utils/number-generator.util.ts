// utils/number-generator.util.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Invoice } from '../invoices/entities/invoice.entity';

@Injectable()
export class NumberGenerator {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  /**
   * Generate sequential tracking number for orders
   * Format: Pure number starting from 100000
   */
  async generateOrderTrackingNumber(): Promise<number> {
    // Get the latest order by tracking number
    const latestOrder = await this.orderRepository
      .createQueryBuilder('order')
      .orderBy('order.tracking_number', 'DESC')
      .getOne();

    if (!latestOrder) {
      // Start from 100000 for first order
      return 100000;
    }

    // Increment by 1
    return Number(latestOrder.tracking_number) + 1;
  }

  /**
   * Alternative: Generate tracking number with date component
   * Format: YYMMDD + sequential (e.g., 240701001)
   */
  async generateDatedOrderTrackingNumber(): Promise<number> {
    const today = new Date();
    const datePrefix = 
      today.getFullYear().toString().slice(2) + // YY
      (today.getMonth() + 1).toString().padStart(2, '0') + // MM
      today.getDate().toString().padStart(2, '0'); // DD

    // Convert prefix to number (e.g., 240701)
    const prefix = parseInt(datePrefix, 10) * 1000; // Multiply by 1000 for sequence space

    // Get today's orders
    const todayOrders = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.tracking_number >= :start', { 
        start: prefix 
      })
      .andWhere('order.tracking_number < :end', { 
        end: prefix + 1000 
      })
      .orderBy('order.tracking_number', 'DESC')
      .getOne();

    if (!todayOrders) {
      return prefix + 1;
    }

    return todayOrders.tracking_number + 1;
  }

  /**
   * Generate sequential invoice number
   * Format: Pure number starting from 100000
   */
  async generateInvoiceNumber(): Promise<number> {
    // Get the latest invoice by invoice number
    const latestInvoice = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .orderBy('invoice.invoice_number', 'DESC')
      .getOne();

    if (!latestInvoice) {
      // Start from 100000 for first invoice
      return 100000;
    }

    // Increment by 1
    return latestInvoice.invoice_number + 1;
  }

  /**
   * Alternative: Generate invoice number with date component
   * Format: YYMMDD + sequential (e.g., 240701001)
   */
  async generateDatedInvoiceNumber(): Promise<number> {
    const today = new Date();
    const datePrefix = 
      today.getFullYear().toString().slice(2) + // YY
      (today.getMonth() + 1).toString().padStart(2, '0') + // MM
      today.getDate().toString().padStart(2, '0'); // DD

    const prefix = parseInt(datePrefix, 10) * 1000;

    // Get today's invoices
    const todayInvoices = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .where('invoice.invoice_number >= :start', { 
        start: prefix 
      })
      .andWhere('invoice.invoice_number < :end', { 
        end: prefix + 1000 
      })
      .orderBy('invoice.invoice_number', 'DESC')
      .getOne();

    if (!todayInvoices) {
      return prefix + 1;
    }

    return todayInvoices.invoice_number + 1;
  }

  /**
   * Generate number with prefix (if you want mixed format but still numeric)
   * Example returns: 100001, 100002, etc.
   */
  async generateCustomNumber(repository: Repository<any>, column: string, startFrom: number = 100000): Promise<number> {
    const latest = await repository
      .createQueryBuilder('entity')
      .orderBy(`entity.${column}`, 'DESC')
      .getOne();

    if (!latest) {
      return startFrom;
    }

    return latest[column] + 1;
  }

  /**
   * Reserve a block of numbers (useful for batch operations)
   */
  async reserveNumberBlock(repository: Repository<any>, column: string, blockSize: number = 1): Promise<number> {
    // This is a simplified version - in production you'd use database sequences
    const latest = await repository
      .createQueryBuilder('entity')
      .orderBy(`entity.${column}`, 'DESC')
      .getOne();

    const startNumber = latest ? latest[column] + 1 : 100000;
    return startNumber;
  }
}
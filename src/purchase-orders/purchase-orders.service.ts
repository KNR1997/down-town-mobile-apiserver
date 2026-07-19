import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { Warehouse } from 'src/warehouses/entities/warehouse.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderStatus } from 'src/common/enums';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { GetPurchaseOrdersDto } from './dto/get-purchase-order.dto';
import { paginate } from 'src/common/pagination/paginate';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private readonly purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Transactional()
  async create(createPurchaseOrderDto: CreatePurchaseOrderDto) {
    try {
      const {
        supplier_id,
        warehouse_id,
        received_by,
        items,
        order_date,
        expected_delivery_date,
      } = createPurchaseOrderDto;

      // ---------------------------------------------------
      // Validate Supplier
      // ---------------------------------------------------
      const supplier = await this.supplierRepository.findOne({
        where: { id: supplier_id },
      });

      if (!supplier) {
        throw new NotFoundException('Supplier not found.');
      }

      // ---------------------------------------------------
      // Validate Warehouse
      // ---------------------------------------------------
      const warehouse = await this.warehouseRepository.findOne({
        where: { id: warehouse_id },
      });

      if (!warehouse) {
        throw new NotFoundException('Warehouse not found.');
      }

      // ---------------------------------------------------
      // Validate User
      // ---------------------------------------------------
      // const user = await this.userRepository.findOne({
      //   where: { id: received_by },
      // });

      // if (!user) {
      //   throw new NotFoundException('Received by user not found.');
      // }

      // ---------------------------------------------------
      // Create Purchase Order Header
      // ---------------------------------------------------
      const purchaseOrder = new PurchaseOrder();

      purchaseOrder.po_number = await this.generatePONumber();
      purchaseOrder.supplier = supplier;
      purchaseOrder.warehouse = warehouse;
      purchaseOrder.status = PurchaseOrderStatus.DRAFT;
      const now = new Date();
      purchaseOrder.order_date = order_date ?? now;
      if (expected_delivery_date)
        purchaseOrder.expected_delivery_date = expected_delivery_date;
      purchaseOrder.remarks = PurchaseOrderStatus.DRAFT;

      const savedPurchaseOrder =
        await this.purchaseOrderRepository.save(purchaseOrder);

      // ---------------------------------------------------
      // Create Purchase Order Items
      // ---------------------------------------------------
      const purchaseOrderItems: PurchaseOrderItem[] = [];

      const productIds = items.map((item) => item.product_id);

      const products = await this.productRepository.find({
        where: {
          id: In(productIds),
        },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      for (const item of items) {
        const product = productMap.get(item.product_id);

        if (!product) {
          throw new NotFoundException(
            `Product (${item.product_id}) not found.`,
          );
        }

        const purchaseOrderItem = this.purchaseOrderItemRepository.create({
          purchaseOrder: savedPurchaseOrder,
          product,
          ordered_quantity: item.quantity,
          purchase_price: item.purchase_price ?? 0,
        });

        purchaseOrderItems.push(purchaseOrderItem);
      }
      await this.purchaseOrderItemRepository.save(purchaseOrderItems);

      return await this.purchaseOrderRepository.findOne({
        where: { id: savedPurchaseOrder.id },
        relations: {
          supplier: true,
          warehouse: true,
          // received_by: true,
          items: {
            product: true,
          },
        },
      });
    } catch (error: any) {
      console.error('Error creating GRN:', error);
      throw new InternalServerErrorException(
        `Failed to create GRN: ${error.message}`,
      );
    }
  }

  private async generatePONumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Get count of POs created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await this.purchaseOrderRepository
      .createQueryBuilder('grn')
      .where('grn.created_at >= :today', { today })
      .andWhere('grn.created_at < :tomorrow', { tomorrow })
      .getCount();

    const sequence = (count + 1).toString().padStart(4, '0');
    return `PO-${year}${month}${day}-${sequence}`;
  }

  @Transactional()
  async approve(id: number, approvedBy: number) {
    try {
      const purchaseOrder = await this.purchaseOrderRepository.findOne({
        where: { id },
        relations: {
          warehouse: true,
          items: {
            product: true,
          },
        },
      });

      if (!purchaseOrder) {
        throw new NotFoundException('Purchase Order not found.');
      }

      if (purchaseOrder.status !== PurchaseOrderStatus.DRAFT) {
        throw new BadRequestException('Only draft Purchase Orders can be approved.');
      }

      const user = await this.userRepository.findOne({
        where: { id: approvedBy },
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      purchaseOrder.status = PurchaseOrderStatus.APPROVED;
      purchaseOrder.approved_at = new Date();
      purchaseOrder.approved_by = user;

      await this.purchaseOrderRepository.save(purchaseOrder);

      return await this.purchaseOrderRepository.findOne({
        where: { id: purchaseOrder.id },
        relations: {
          supplier: true,
          warehouse: true,
          approved_by: true,
          items: {
            product: true,
          },
        },
      });
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to approve Purchase Order: ${error.message}`,
      );
    }
  }

  async findAll({
    limit = 30,
    page = 1,
    search,
    orderBy,
    sortedBy,
  }: GetPurchaseOrdersDto) {
    const skip = (page - 1) * limit;

  const query = this.purchaseOrderRepository
    .createQueryBuilder('purchase_orders')
    .leftJoinAndSelect('purchase_orders.supplier', 'supplier')
    .leftJoinAndSelect('purchase_orders.warehouse', 'warehouse');

    // SAFE SORTING
    const allowedOrderByFields = ['created_at', 'name', 'slug'];

    const safeOrderBy = allowedOrderByFields.includes(orderBy)
      ? orderBy
      : 'created_at';

    const safeSortedBy = sortedBy?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query.orderBy(`purchase_orders.${safeOrderBy}`, safeSortedBy);

    // Optional search
    if (search) {
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/purchase_orders?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async findOne(id: number) {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: {
        supplier: true,
        warehouse: true,
        items: {
          product: true,
        },
      },
    });

    if (!purchaseOrder) {
      throw new NotFoundException(`Purchase Order with id "${id}" not found`);
    }

    return purchaseOrder;
  }

  update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return `This action updates a #${id} purchaseOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrder`;
  }

  @Transactional()
  async createGrn() {
    
  }
}

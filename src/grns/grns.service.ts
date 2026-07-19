import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGrnDto } from './dto/create-grn.dto';
import { UpdateGrnDto } from './dto/update-grn.dto';
import { In, Repository } from 'typeorm';
import { GoodsReceivedNote } from './entities/grn.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsReceivedItem } from './entities/grn-item.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { Warehouse } from 'src/warehouses/entities/warehouse.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Transactional } from 'typeorm-transactional';
import { GetGRNsDto } from './dto/get-grn.dto';
import { paginate } from 'src/common/pagination/paginate';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { StockMovement } from 'src/stock-movements/entities/stock-movement.entity';
import { GRNStatus, StockMovementType } from 'src/common/enums';
import { PurchaseOrder } from 'src/purchase-orders/entities/purchase-order.entity';

@Injectable()
export class GrnsService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(GoodsReceivedNote)
    private readonly grnRepository: Repository<GoodsReceivedNote>,
    @InjectRepository(GoodsReceivedItem)
    private readonly grnItemRepository: Repository<GoodsReceivedItem>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
  ) {}

  @Transactional()
  async create(createGrnDto: CreateGrnDto) {
    try {
      const { purchase_order, received_by, items, ...grnData } = createGrnDto;

      // ---------------------------------------------------
      // Validate Purchase Order
      // ---------------------------------------------------
      const purchaseOrder = await this.purchaseOrderRepository.findOne({
        where: { id: purchase_order },
      });

      if (!purchaseOrder) {
        throw new NotFoundException('Purchase Order not found.');
      }

      // ---------------------------------------------------
      // Validate Supplier
      // ---------------------------------------------------
      // const supplier = await this.supplierRepository.findOne({
      //   where: { id: supplier_id },
      // });

      // if (!supplier) {
      //   throw new NotFoundException('Supplier not found.');
      // }

      // ---------------------------------------------------
      // Validate Warehouse
      // ---------------------------------------------------
      // const warehouse = await this.warehouseRepository.findOne({
      //   where: { id: warehouse_id },
      // });

      // if (!warehouse) {
      //   throw new NotFoundException('Warehouse not found.');
      // }

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
      // Create GRN Header
      // ---------------------------------------------------
      const now = new Date();
      const grn = this.grnRepository.create({
        ...grnData,
        grn_number: await this.generateGrnNumber(),
        purchase_order: purchaseOrder,
        supplier: purchaseOrder.supplier,
        warehouse: purchaseOrder.warehouse,
        received_at: now, // Todo -> fix me
        // received_by: user,
      });

      const savedGrn = await this.grnRepository.save(grn);

      // ---------------------------------------------------
      // Create GRN Items
      // ---------------------------------------------------
      const grnItems: GoodsReceivedItem[] = [];

      const productIds = items.map((item) => item.product_id);

      const products = await this.productRepository.find({
        where: {
          id: In(productIds),
        },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      for (const item of items) {
        // const product = await this.productRepository.findOne({
        //   where: { id: item.product_id },
        // });

        const product = productMap.get(item.product_id);

        if (!product) {
          throw new NotFoundException(
            `Product (${item.product_id}) not found.`,
          );
        }

        const grnItem = this.grnItemRepository.create({
          grn: savedGrn,
          product,
          quantity: item.quantity,
          purchase_price: item.purchase_price,
          selling_price: item.selling_price,
          batch_number: item.batch_number,
          expiry_date: item.expiry_date,
        });

        grnItems.push(grnItem);
      }
      await this.grnItemRepository.save(grnItems);

      return await this.grnRepository.findOne({
        where: { id: savedGrn.id },
        relations: {
          supplier: true,
          warehouse: true,
          received_by: true,
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

  private async generateGrnNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Get count of GRNs created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await this.grnRepository
      .createQueryBuilder('grn')
      .where('grn.created_at >= :today', { today })
      .andWhere('grn.created_at < :tomorrow', { tomorrow })
      .getCount();

    const sequence = (count + 1).toString().padStart(4, '0');
    return `GRN-${year}${month}${day}-${sequence}`;
  }

  @Transactional()
  async approve(id: number, approvedBy: number) {
    try {
      const grn = await this.grnRepository.findOne({
        where: { id },
        relations: {
          warehouse: true,
          items: {
            product: true,
          },
        },
      });

      if (!grn) {
        throw new NotFoundException('GRN not found.');
      }

      if (grn.status !== GRNStatus.DRAFT) {
        throw new BadRequestException('Only draft GRNs can be approved.');
      }

      const user = await this.userRepository.findOne({
        where: { id: approvedBy },
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      for (const item of grn.items) {
        let inventory = await this.inventoryRepository.findOne({
          where: {
            product: {
              id: item.product.id,
            },
            warehouse: {
              id: grn.warehouse.id,
            },
          },
          relations: {
            product: true,
            warehouse: true,
          },
        });

        if (!inventory) {
          inventory = this.inventoryRepository.create({
            product: item.product,
            warehouse: grn.warehouse,
            quantity: 0,
            reserved_quantity: 0,
            damaged_quantity: 0,
          });
        }

        inventory.quantity = Number(inventory.quantity) + Number(item.quantity);

        await this.inventoryRepository.save(inventory);

        const movement = this.stockMovementRepository.create({
          product: item.product,
          warehouse: grn.warehouse,
          type: StockMovementType.GRN,
          quantity: item.quantity,
          reference_id: grn.id,
          // reference_number: grn.grn_number,
          balance_after: inventory.quantity,
        });

        await this.stockMovementRepository.save(movement);
      }

      grn.status = GRNStatus.APPROVED;
      grn.approved_at = new Date();
      grn.approved_by = user;

      await this.grnRepository.save(grn);

      return await this.grnRepository.findOne({
        where: { id: grn.id },
        relations: {
          supplier: true,
          warehouse: true,
          received_by: true,
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
        `Failed to approve GRN: ${error.message}`,
      );
    }
  }

  async findAll({
    limit = 30,
    page = 1,
    search,
    orderBy,
    sortedBy,
  }: GetGRNsDto) {
    const skip = (page - 1) * limit;

  const query = this.grnRepository
    .createQueryBuilder('grn')
    .leftJoinAndSelect('grn.purchase_order', 'purchase_order');

    // SAFE SORTING
    const allowedOrderByFields = ['created_at', 'name', 'slug'];

    const safeOrderBy = allowedOrderByFields.includes(orderBy)
      ? orderBy
      : 'created_at';

    const safeSortedBy = sortedBy?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query.orderBy(`grn.${safeOrderBy}`, safeSortedBy);

    // Optional search
    if (search) {
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    const url = `/grns?search=${search ?? ''}&limit=${limit}`;

    return {
      data,
      ...paginate(total, page, limit, data.length, url),
    };
  }

  async findOne(id: number) {
    const grn = await this.grnRepository.findOne({
      where: { id },
      relations: {
        purchase_order: true,
                items: {
          product: true,
        },
      },
    });

    if (!grn) {
      throw new NotFoundException(`GRN with id "${id}" not found`);
    }

    return grn;
  }

  update(id: number, updateGrnDto: UpdateGrnDto) {
    return `This action updates a #${id} grn`;
  }

  remove(id: number) {
    return `This action removes a #${id} grn`;
  }
}

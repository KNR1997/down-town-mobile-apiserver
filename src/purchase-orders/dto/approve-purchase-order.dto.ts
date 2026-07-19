import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class ApprovePurchaseOrderDto {
  @ApiProperty({
    description: 'GRN ID',
    example: 1,
    required: true,
  })
  @IsNumber()
  purchase_order_id!: number;

  @ApiProperty({
    description: 'GRN Approved by id',
    example: 1,
    required: true,
  })
  @IsNumber()
  approved_by!: number;
}

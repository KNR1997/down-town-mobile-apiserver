import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GrnsService } from './grns.service';
import { CreateGrnDto } from './dto/create-grn.dto';
import { UpdateGrnDto } from './dto/update-grn.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetGRNsDto, GRNResponseDto } from './dto/get-grn.dto';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { ApproveGrnDto } from './dto/approve-grn.dto';

@ApiTags('grns')
@Controller('grns')
export class GrnsController {
  constructor(private readonly grnsService: GrnsService) {}

  @ApiOperation({ summary: 'Create grn' })
  @ApiResponse({
    status: 201,
    description: 'The grn has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  create(@Body() createGrnDto: CreateGrnDto) {
    return this.grnsService.create(createGrnDto);
  }

  @ApiOperation({ summary: 'Approve grn' })
  @ApiResponse({
    status: 201,
    description: 'The grn has been successfully approved.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/approve')
  approve(@Body() approveGrnDto: ApproveGrnDto) {
    return this.grnsService.approve(
      approveGrnDto.grn_id,
      approveGrnDto.approved_by,
    );
  }

  @ApiOperation({ summary: 'Get paginated grns' })
  @ApiResponse({ status: 200, description: 'Return all grns.' })
  @Get()
  async findAll(@Query() query: GetGRNsDto) {
    const result = await this.grnsService.findAll(query);

    const data = plainToInstance(GRNResponseDto, result.data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto({
      message: 'Get Suppliers successfully',
      statusCode: 200,
      data: {
        ...result,
        data,
      },
    });
  }

  @ApiOperation({ summary: 'Get grn' })
  @ApiResponse({ status: 200, description: 'Return grn.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const grn = await this.grnsService.findOne(id);

    const data = plainToInstance(GRNResponseDto, grn, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponseDto<GRNResponseDto>({
      message: 'Get grn by id successful.',
      statusCode: 200,
      data,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGrnDto: UpdateGrnDto) {
    return this.grnsService.update(+id, updateGrnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grnsService.remove(+id);
  }
}

import { Injectable } from '@nestjs/common';
import { UpdateTypeDto } from './dto/update-type.dto';
import { CreateTypeDto } from './dto/create-type.dto';
import { GetTypesDto } from './dto/get-types.dto';

@Injectable()
export class TypesService {
  getTypes({ text, search }: GetTypesDto) {}

  getTypeBySlug(slug: string) {
    return `This action returns all types`;
  }

  create(createTypeDto: CreateTypeDto) {
    return `create type`;
  }

  findAll() {
    return `This action returns all types`;
  }

  findOne(id: number) {
    return `This action returns a #${id} type`;
  }

  update(id: number, updateTypeDto: UpdateTypeDto) {
    return `Update type`;
  }

  remove(id: number) {
    return `This action removes a #${id} type`;
  }
}

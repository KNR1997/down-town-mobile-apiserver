import { Injectable } from '@nestjs/common';
import { UpdateTypeDto } from './dto/update-type.dto';
import { CreateTypeDto } from './dto/create-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Type } from './entities/type.entity';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(Type)
    private readonly typesRepository: Repository<Type>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createTypeDto: CreateTypeDto) {
    const product = new Type(createTypeDto);
    await this.entityManager.save(product);
  }

  async findAll() {
    return this.typesRepository.find();
  }

  async findOne(id: number) {
    return this.typesRepository.findOneBy({ id });
  }

  async update(id: number, updateTypeDto: UpdateTypeDto) {
    const type = await this.typesRepository.findOneBy({ id });
    if (!type) {
      return;
    }
    type.name = updateTypeDto.name;
    await this.entityManager.save(type);
  }

  async remove(id: number) {
    await this.typesRepository.delete(id);
  }
}

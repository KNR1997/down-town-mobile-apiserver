import { PartialType } from '@nestjs/swagger';
import { CreateTypeDto } from './create-type.dto';

export class UpdateTypeDto {
    name: string;
    slug: string;
    icon: string;
}

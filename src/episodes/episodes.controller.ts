import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { ConfigService } from 'src/config/config.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('episodes')
@Controller('episodes')
export class EpisodesController {
  constructor(
    private episodesService: EpisodesService,
    private configService: ConfigService,
  ) {}

  @Get()
  findAll() {
    return this.episodesService.findAll();
  }

  @Get('featured')
  findFeatured() {
    return this.episodesService.findFeatured();
  }

  @Get(':id')
  findOne(@Param() id: string) {
    return this.episodesService.findOne(id);
  }

  @Post()
  create(@Body(ValidationPipe) input: CreateEpisodeDto) {
    return this.episodesService.create(input);
  }
}

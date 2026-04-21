import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { Episode } from './entity/episode.entity';

@Injectable()
export class EpisodesService {
  private episodes: Episode[] = [];

  async findAll() {}

  async findFeatured() {}

  async findOne(id: string) {
    return this.episodes.find((episode) => episode.id === id);
  }

  async create(createEpisodeDto: CreateEpisodeDto) {
    const newEpisode = { ...createEpisodeDto, id: randomUUID() };
    this.episodes.push(newEpisode);

    return newEpisode;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';

import { Lobby } from './lobby.entity';
import { User } from '../users/user.entity';

import { LobbyStatusEnum } from './utils/enums';

@Injectable()
export class LobbiesService {
  constructor(
    @InjectRepository(Lobby)
    private lobbiesRepository: Repository<Lobby>,
  ) {}

  async create(leader: User): Promise<Lobby> {
    const lobby = new Lobby();
    lobby.leaderId = leader.id;
    lobby.password = nanoid();
    lobby.players = [leader];
    lobby.size = 2; // TEMP
    lobby.status = LobbyStatusEnum.AVAILABLE;

    return this.lobbiesRepository.create(lobby);
  }

  findAll(): Promise<Lobby[]> {
    return this.lobbiesRepository.find();
  }

  findAllAvailable(): Promise<Lobby[]> {
    return this.lobbiesRepository.find({
      status: LobbyStatusEnum.AVAILABLE,
    });
  }

  findOne(id: string): Promise<Lobby> {
    return this.lobbiesRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.lobbiesRepository.delete(id);
  }
}

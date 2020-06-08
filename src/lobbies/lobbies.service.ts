import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';

import { Lobby } from './lobby.entity';
import { User } from '../users/user.entity';

import { LobbyStatusEnum } from './utils/enums';
import { JoinLobbyDto } from './dto/join-lobby.dto';

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

    return this.lobbiesRepository.save(lobby);
  }

  async join(
    id: string,
    user: User,
    joinLobbyDto: JoinLobbyDto,
  ): Promise<Lobby> {
    const lobby = await this.findOne(id);

    if (!lobby) {
      console.log('Lobby not found');
      throw new UnauthorizedException();
    }

    if (lobby.password !== joinLobbyDto.password) {
      console.log('Wrong lobby pwd');
      throw new UnauthorizedException();
    }

    if (lobby.players.length >= lobby.size) {
      console.log('Lobby full');
      throw new UnauthorizedException();
    }

    if (lobby.players.find((player) => player.id === user.id)) {
      console.log('No user duplicate');
      throw new UnauthorizedException();
    }

    lobby.players.push(user);
    return this.lobbiesRepository.save(lobby);
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
    return this.lobbiesRepository.findOne({
      where: { id },
      relations: ['players'],
    });
  }

  async remove(id: string): Promise<void> {
    await this.lobbiesRepository.delete(id);
  }
}

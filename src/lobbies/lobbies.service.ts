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

  async join(id: string, user: User): Promise<Lobby> {
    const lobby = await this.findOne(id);

    if (!lobby) {
      console.log('Lobby not found');
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

  async leave(id: string, user: User): Promise<Lobby> {
    const lobby = await this.findOne(id);

    if (!lobby) {
      console.log('Lobby not found');
      throw new UnauthorizedException();
    }

    const isPlayerInLobby = lobby.players.find(
      (player) => player.id === user.id,
    );
    if (!isPlayerInLobby) {
      console.log('User is not in this lobby');
      throw new UnauthorizedException();
    }

    if (lobby.players.length <= 1) {
      console.log('Cannot leave a lobby with just 1 player');
      throw new UnauthorizedException();
    }

    const newLobbyPlayers = lobby.players.filter(
      (player) => player.id !== user.id,
    );
    lobby.players = newLobbyPlayers;
    if (lobby.leaderId === user.id) {
      lobby.leaderId = lobby.players[0].id;
    }

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

  async remove(id: string, user: User): Promise<void> {
    const lobby = await this.findOne(id);

    if (lobby.players.length !== 1) {
      console.log('Lobby has another players');
      return;
    }

    if (lobby.players[0].id !== user.id) {
      console.log('User is not in this lobby');
      return;
    }

    await this.lobbiesRepository.delete(id);
  }
}

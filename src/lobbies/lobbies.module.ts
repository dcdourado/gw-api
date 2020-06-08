import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LobbiesService } from './lobbies.service';
import { LobbiesController } from './lobbies.controller';
import { Lobby } from './lobby.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lobby])],
  providers: [LobbiesService],
  controllers: [LobbiesController],
})
export class LobbiesModule {}

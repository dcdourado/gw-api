import {
  Req,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Lobby } from './lobby.entity';
import { LobbiesService } from './lobbies.service';
import { JoinLobbyDto } from './dto/join-lobby.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('lobbies')
export class LobbiesController {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @Post()
  create(@Req() req): Promise<Lobby> {
    return this.lobbiesService.create(req.user);
  }

  @Put(':id/join')
  join(
    @Param('id') id: string,
    @Req() req,
    @Body() joinLobbyDto: JoinLobbyDto,
  ): Promise<Lobby> {
    return this.lobbiesService.join(id, req.user, joinLobbyDto);
  }

  @Put(':id/leave')
  leave(@Param('id') id: string, @Req() req): Promise<Lobby> {
    return this.lobbiesService.leave(id, req.user);
  }

  @Get()
  findAll(): Promise<Lobby[]> {
    return this.lobbiesService.findAllAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Lobby> {
    return this.lobbiesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req): Promise<void> {
    return this.lobbiesService.remove(id, req.user);
  }
}

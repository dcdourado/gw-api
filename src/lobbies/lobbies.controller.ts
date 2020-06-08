import {
  Req,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Lobby } from './lobby.entity';
import { LobbiesService } from './lobbies.service';

@UseGuards(AuthGuard('jwt'))
@Controller('lobbies')
export class LobbiesController {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @Post()
  create(@Req() req): Promise<Lobby> {
    return this.lobbiesService.create(req.user);
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
  remove(@Param('id') id: string): Promise<void> {
    return this.lobbiesService.remove(id);
  }
}

import { Req, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { Lobby } from './lobby.entity';
import { UsersService } from './users.service';

@Controller('users')
export class LobbiesController {
  constructor(private readonly lobbiesService: UsersService) {}

  @Post()
  create(@Req() req): Promise<Lobby> {
    return this.lobbiesService.create(req.user);
  }

  @Get()
  findAll(): Promise<Lobby[]> {
    return this.lobbiesService.findAll();
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

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { UsersService } from '~/users/users.service';
import { User } from '~/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      return;
    }

    const passwordMatches = await compare(password, user.password);
    if (passwordMatches) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = { id: user.id, username: user.username, mmr: user.mmr };
    return {
      id: user.id,
      username: user.username,
      mmr: user.mmr,
      token: this.jwtService.sign(payload),
    };
  }
}

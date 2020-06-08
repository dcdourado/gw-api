import { IsString } from 'class-validator';

export class JoinLobbyDto {
  @IsString()
  password: string;
}

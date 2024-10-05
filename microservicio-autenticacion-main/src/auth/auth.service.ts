import {
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.adminClient
        .send('findByUsername', username)
        .toPromise();

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  async login(user: any): Promise<{
    access_token: string;
    name: string;
    username: string;
    profileId: number;
    userId: number;
  }> {
    const userData = await this.adminClient
      .send('findByUsername', user.email)
      .toPromise();

    if (!userData) {
      throw new UnauthorizedException('Usuario invalido');
    }

    // const perfil = await this.adminClient
    //   .send('findOneProfile', userData.profile.id)
    //   .toPromise();

    // if (!perfil || !perfil.pages) {
    //   throw new Error('Profile or profile pages not found');
    // }

    const payload = {
      sub: userData.id,
      username: userData.email,
      name: userData.name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      name: userData.name,
      username: userData.email,
      profileId: userData.profile.id,
      userId: userData.id,
    };
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}

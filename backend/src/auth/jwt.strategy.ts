import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.sub);
    
    // Добавляем roles в объект пользователя для RolesGuard
    if (user && user.userRoles) {
      return {
        ...user,
        roles: user.userRoles.map(role => role.role),
      };
    }
    
    return user;
  }
}
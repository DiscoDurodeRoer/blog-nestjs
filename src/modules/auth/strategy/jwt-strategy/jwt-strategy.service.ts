import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../../dto/jwt-payload';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {

    constructor(
        private configService: ConfigService,
        private userService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategyService.extractJWTFromCookie,
            ]),
            secretOrKey: configService.get('auth.secretKey')
        })
    }

    private static extractJWTFromCookie(req: Request): string | null {
        if (req.cookies && req.cookies.AUTH) {
            return req.cookies.AUTH;
        }
        return null;
    }

    async validate(payload: JwtPayload) {

        const user = await this.userService.findUserbyEmail(payload.email);

        if (user.email != payload.email) {
            throw new UnauthorizedException();
        }
        return user.email;

    }

}
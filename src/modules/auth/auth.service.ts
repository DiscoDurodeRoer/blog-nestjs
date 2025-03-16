import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './dto/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthToken } from './dto/auth-token.model';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService, private userService: UsersService, private config: ConfigService) { }

    private async validateCredentials(userCredentials: AuthCredentialsDto) {

        const user = await this.userService.findUserbyEmail(userCredentials.email);

        if (user) {
            const passwordOk = await bcrypt.compare(userCredentials.password, user.password);

            if (passwordOk) {
                return user;
            }
        }

        return null;
    }

    async loginUser(authCredentials: AuthCredentialsDto, res: Response) {

        const user = await this.validateCredentials(authCredentials);

        if (!user) {
            throw new UnauthorizedException("Credenciales inválidas")
        }

        return this.login(user.email, res);

    }

    login(email: string, res: Response) {

        const payload: JwtPayload = {
            email
        }

        const accessToken = this.jwtService.sign(payload, { expiresIn: this.config.get('auth.authExpiresIn') });
        const accessTokenExpires = ms(this.config.get('auth.authExpiresIn'))

        res.cookie('AUTH', accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: accessTokenExpires,
            sameSite: 'strict',
        });

        const refreshToken = this.jwtService.sign(payload, { expiresIn: this.config.get('auth.refreshExpiresIn') });
        const refreshTokenExpires = ms(this.config.get('auth.refreshExpiresIn'))

        res.cookie('REFRESH', refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: refreshTokenExpires,
            sameSite: 'strict',
        })

        return {
            accessToken,
            refreshToken,
            accessTokenExpires,
            refreshTokenExpires
        } as AuthToken
    }


    async refreshToken(refresh: RefreshTokenDto, res: Response) {
        const payload = this.jwtService.verify(refresh.refreshToken);
        if (payload) {
            const user = await this.userService.findUserbyEmail(payload.email);
            if (user) {
                return this.login(user.email, res);
            }
        }
        throw new Error('Invalid token');
    }

    logout(res: Response) {
        res.clearCookie('AUTH', { httpOnly: true, secure: false });
        res.clearCookie('REFRESH', { httpOnly: true, secure: false });
    }

}

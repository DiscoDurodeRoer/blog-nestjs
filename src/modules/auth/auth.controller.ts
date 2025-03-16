import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthToken } from './dto/auth-token.model';

@Controller('/api/v1/auth')
@ApiTags('Auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/login')
    @ApiOperation({
        description: 'Loguea un usuario'
    })
    @ApiBody({
        type: AuthCredentialsDto,
        description: 'Datos necesarios para loguearnos'
    })
    @ApiResponse({
        status: 201,
        description: 'Logueado correctamente',
        type: AuthToken
    })
    @ApiResponse({
        status: 401,
        description: `Usuario no autorizado`
    })
    login(@Body() authCredentials: AuthCredentialsDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.loginUser(authCredentials, res);
    }

    @Post('/refresh')
    @ApiOperation({
        description: 'Refresca el token de un usuario'
    })
    @ApiBody({
        type: RefreshTokenDto,
        description: 'Refresca el token de un usuario pasandole un refreshToken'
    })
    @ApiResponse({
        status: 201,
        type: AuthToken,
        description: 'Token refrescado correctamente'
    })
    async refresh(@Body() refreshToken: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.refreshToken(refreshToken, res);
    }

    @Post('/logout')
    @ApiOperation({
        description: 'Nos desloguea de la aplicación'
    })
    @ApiResponse({
        status: 201,
        description: 'Deslogueado de la aplicación'
    })
    async logout(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }

}

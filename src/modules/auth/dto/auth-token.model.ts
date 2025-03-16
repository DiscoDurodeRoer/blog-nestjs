import { ApiProperty } from "@nestjs/swagger";

export class AuthToken {

    @ApiProperty({
        name: 'accessToken',
        type: String,
        description: 'Token de acceso a la aplicación'
    })
    accessToken: string;

    @ApiProperty({
        name: 'refreshToken',
        type: String,
        description: 'Token de refresco de la aplicación'
    })
    refreshToken: string;

    @ApiProperty({
        name: 'accessTokenExpires',
        type: Number,
        description: 'Tiempo en el que expira el token de acesso'
    })
    accessTokenExpires: number;

    @ApiProperty({
        name: 'refreshTokenExpires',
        type: String,
        description: 'Tiempo en el que expira el token de refresco'
    })
    refreshTokenExpires: number;

}
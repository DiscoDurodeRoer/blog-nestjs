import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RefreshTokenDto {

    @ApiProperty({
        name: 'refreshToken',
        type: String,
        required: true,
        description: 'Token de refresco'
    })
    @IsNotEmpty()
    refreshToken!: string;

}
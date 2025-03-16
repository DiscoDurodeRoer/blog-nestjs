import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CategoryDto {

    @ApiProperty({
        name: 'name',
        type: String,
        description: 'Nombre de la categoria',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        name: 'order',
        type: Number,
        description: 'Orden de la categoria',
        required: false
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    order?: number;

    @ApiProperty({
        name: 'parent',
        oneOf: [
            {
                type: 'string'
            },
            {
                type: 'CategoryDto',
            }
        ],
        description: 'Categoria padre',
        required: false,
    })
    @Type(() => CategoryDto || String)
    @IsOptional()
    parent?: CategoryDto | string;

}
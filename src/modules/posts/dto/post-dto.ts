import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsArray, IsDate, IsOptional, MaxLength, IsDateString } from "class-validator";

export class PostDto {

    @ApiProperty({
        name: 'title',
        type: String,
        description: 'Titulo del post',
        maxLength: 100,
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    title!: string;

    @ApiProperty({
        name: 'content',
        type: String,
        description: 'Contenido del post',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    content!: string;

    @ApiProperty({
        name: 'categories',
        type: String,
        description: 'Categorías del post',
        required: true
    })
    @IsArray()
    @IsOptional()
    @Transform(({ value }) => {
        try {
            return JSON.parse(value) || [];
        } catch (e) {
            return [];
        }
    })
    categories?: string;

    @ApiProperty({
        name: 'publishedDate',
        type: String,
        description: 'Fecha de publicacion del post',
        required: false
    })
    @IsDateString()
    @IsOptional()
    publishedDate?: string;

}
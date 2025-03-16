import { ApiProperty } from "@nestjs/swagger";
import { Category } from "src/modules/categories/schemas/category.schema";

export class Post {

    @ApiProperty({
        name: '_id',
        type: String,
        description: 'Id del post',
        required: false
    })
    id?: string;

    @ApiProperty({
        name: 'title',
        type: String,
        description: 'Titulo del post',
        maxLength: 100,
        required: true
    })
    title!: string;

    @ApiProperty({
        name: 'content',
        type: String,
        description: 'Contenido del post',
        required: true
    })
    content!: string;

    @ApiProperty({
        name: 'categories',
        type: [Category],
        description: 'Categorías del post',
        required: true
    })
    categories: Category[];

    @ApiProperty({
        name: 'publishedDate',
        type: String,
        description: 'Fecha de publicacion del post',
        required: false
    })
    publishedDate?: string;

    @ApiProperty({
        name: 'img',
        type: String,
        description: 'Ruta de la imagen'
    })
    img: string;

}
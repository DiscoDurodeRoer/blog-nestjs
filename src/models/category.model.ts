import { ApiProperty } from "@nestjs/swagger";

export class Category {

    @ApiProperty({
        name: 'name',
        type: String,
        description: 'Nombre de la categoria',
        required: true
    })
    name!: string;

    @ApiProperty({
        name: 'order',
        type: Number,
        description: 'Orden de la categoria',
        required: false
    })
    order?: number;

    @ApiProperty({
        name: 'parent',
        oneOf: [
            {
                type: 'string'
            },
            {
                type: 'Category',
            }
        ],
        description: 'Categoria padre',
        required: false,
    })
    parent?: Category | string;

    @ApiProperty({
        name: 'children',
        type: [Category],
        description: 'Categorías hijas',
        required: false,
    })
    children?: Category[];
}
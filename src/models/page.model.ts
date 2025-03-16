import { Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from "@nestjs/swagger";

export interface IPage<T> {
    content: T[],
    page: number,
    size: number,
    total: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPrevPage: boolean,
    nextPage: number,
    prevPage: number
}

export class Page<T> {
    @ApiProperty({
        name: 'content',
        description: 'Datos de la paginación',
        required: true
    })
    content: T[];

    @ApiProperty({
        name: 'page',
        type: Number,
        description: 'Pagina actual',
        required: true
    })
    page: number;

    @ApiProperty({
        name: 'size',
        type: Number,
        description: 'Tamaño paginacion',
        required: true
    })
    size: number;

    @ApiProperty({
        name: 'total',
        type: Number,
        description: 'Total de elementos',
        required: true
    })
    total: number;

    @ApiProperty({
        name: 'totalPages',
        type: Number,
        description: 'Total de páginas',
        required: true
    })
    totalPages: number;

    @ApiProperty({
        name: 'hasNextPage',
        type: Boolean,
        description: 'Indica si hay una siguiente página',
        required: true
    })
    hasNextPage: boolean;

    @ApiProperty({
        name: 'hasPrevPage',
        type: Boolean,
        description: 'Indica si hay una página previa',
        required: true
    })
    hasPrevPage: boolean;

    @ApiProperty({
        name: 'nextPage',
        type: Number,
        description: 'Siguiente página',
        required: true
    })
    nextPage: number;

    @ApiProperty({
        name: 'prevPage',
        type: Number,
        description: 'Página previa',
        required: true
    })
    prevPage: number;
}

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
    applyDecorators(
        ApiExtraModels(Page, dataDto),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(Page) },
                    {
                        properties: {
                            content: {
                                type: 'array',
                                items: { $ref: getSchemaPath(dataDto) },
                            },
                        },
                    },
                ],
            },
        }),
    )
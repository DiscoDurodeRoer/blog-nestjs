import { ApiProperty } from "@nestjs/swagger"

export class DeleteResult {

    @ApiProperty({
        name: 'acknowledged',
        type: Boolean,
        description: 'Indica si la operación ha sido confirmada'
    })
    acknowledged: boolean;

    @ApiProperty({
        name: 'deletedCount',
        type: Number,
        description: 'Número de elementos borrados'
    })
    deletedCount: number
}

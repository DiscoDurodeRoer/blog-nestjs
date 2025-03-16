import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/category-dto';
import { AuthGuard } from '@nestjs/passport';
import { GreaterZeroPipe } from 'src/pipes/greater-zero/greater-zero.pipe';
import { ApiOkResponsePaginated, Page } from 'src/models/page.model';
import { DeleteResult } from 'src/models/delete-result.model';
import { Category } from 'src/models/category.model';

@Controller('/api/v1/categories')
@ApiTags('Categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('jwt')
    @ApiOperation({
        description: 'Crea una categoría'
    })
    @ApiBody({
        type: CategoryDto,
        description: 'Crea una categoría usando un CategoryDto'
    })
    @ApiResponse({
        status: 201,
        description: 'Categoría creada',
        type: CategoryDto
    })
    @ApiResponse({
        status: 401,
        description: `Usuario no autorizado`
    })
    @ApiResponse({
        status: 409,
        description: 'La categoria existe<br/>La categoria padre no existe'
    })
    create(@Body() category: CategoryDto) {
        return this.categoriesService.create(category);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('jwt')
    @ApiOperation({
        description: 'Obtiene las categorías de forma paginada'
    })
    @ApiOkResponsePaginated(CategoryDto)
    @ApiQuery({
        name: 'q',
        description: 'Texto a buscar en las categorías',
        required: false
    })
    @ApiQuery({
        name: 'page',
        description: 'Página en la que queremos buscar las categorías',
        required: false
    })
    @ApiQuery({
        name: 'size',
        description: 'Numero de elementos que vamos a traer',
        required: false
    })
    @ApiQuery({
        name: 'sortBy',
        description: 'Campo por el que buscar',
        required: false
    })
    @ApiQuery({
        name: 'sort',
        description: 'Direccion en la que buscar: ASC o DESC',
        required: false
    })
    @ApiResponse({
        status: 200,
        description: 'Categorías de la pagina solicitada'
    })
    @ApiResponse({
        status: 401,
        description: `Usuario no autorizado`
    })
    get(
        @Query('q') q: string,
        @Query('page', GreaterZeroPipe) page: number,
        @Query('size', GreaterZeroPipe) size: number,
        @Query('sortBy') sortBy: string,
        @Query('sort') sort: string
    ) {
        return this.categoriesService.get(page, size, q, sortBy, sort);
    }

    @Get('/all')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('jwt')
    @ApiOperation({
        description: 'Obtiene todas las categorías'
    })
    @ApiResponse({
        status: 200,
        description: 'Todas las categorias',
        type: [CategoryDto]
    })
    @ApiResponse({
        status: 200,
        description: 'Todas las categorías'
    })
    @ApiResponse({
        status: 401,
        description: `Usuario no autorizado`
    })
    getAll() {
        return this.categoriesService.getAll();
    }

    @Get('/public')
    @ApiOperation({
        description: 'Obtiene todas las categorias en formato menu'
    })
    @ApiResponse({
        status: 200,
        type: [Category],
        description: 'todas las categorias'
    })
    getCategoriesFromPublic() {
        return this.categoriesService.getPublic();
    }

    @Get('/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('jwt')
    @ApiOperation({
        description: 'Obtiene la categoría dado un id'
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'ID de la categoría a obtener'
    })
    @ApiResponse({
        status: 200,
        type: CategoryDto,
        description: 'Categoría del id dado'
    })
    @ApiResponse({
        status: 401,
        description: `Usuario no autorizado`
    })
    getById(@Param('id') id: string) {
        return this.categoriesService.getById(id);
    }

    @Put("/:id")
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('jwt')
    @ApiOperation({
        description: 'Actualiza una categoría dado un id'
    })
    @ApiBody({
        type: CategoryDto,
        description: 'Datos a actualizar de la categoría'
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'ID de la categoría a actualizar'
    })
    @ApiResponse({
        status: 200,
        type: CategoryDto,
        description: 'Categoría del id dado'
    })
    @ApiResponse({
        status: 401,
        description: `Usuario no autorizado`
    })
    @ApiResponse({
        status: 409,
        description: 'La categoria padre no existe<br/>No se puede actualizar la categoria'
    })
    update(@Param('id') id: string, @Body() category: CategoryDto) {
        return this.categoriesService.update(id, category);
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(new ParseArrayPipe({ items: String, separator: ',' }))
    @ApiBearerAuth('jwt')
    @ApiOperation({
        description: 'Borra las categorías dado unos ids'
    })
    @ApiQuery({
        name: 'ids',
        description: 'ids de categorías a borrar separados por comas',
        type: String
    })
    @ApiResponse({
        status: 200,
        type: DeleteResult,
        description: 'Resultado del borrado'
    })
    @ApiResponse({
        status: 401,
        description: `Usuario no autorizado`
    })
    @ApiResponse({
        status: 409,
        description: 'No hay categorias que borrar<br/>La categoria no existe'
    })
    deleteMany(@Query('ids') idsCategories: string[]) {
        return this.categoriesService.deleteMany(idsCategories);
    }

}

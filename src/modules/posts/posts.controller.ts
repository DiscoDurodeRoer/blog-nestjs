import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostDto } from './dto/post-dto';
import { Post as PostModel } from '../../models/post.model';
import { AuthGuard } from '@nestjs/passport';
import { GreaterZeroPipe } from 'src/pipes/greater-zero/greater-zero.pipe';
import { ApiOkResponsePaginated } from 'src/models/page.model';
import { DeleteResult } from 'src/models/delete-result.model';

@Controller('/api/v1/posts')
@ApiTags('Posts')
export class PostsController {

    constructor(private postsService: PostsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('img'))
    @ApiConsumes('multipart/form-data')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('jwt')
    @ApiOperation({
        description: 'Crea un post'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                content: { type: 'string' },
                categories: { type: 'string' },
                publishedDate: { type: 'string' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Post creado',
        type: PostModel
    })
    @ApiResponse({
        status: 401,
        description: `Usuario no autorizado`
    })
    create(@UploadedFile() img: Express.Multer.File, @Body() post: PostDto) {
        return this.postsService.create(post, img);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('jwt')
    @ApiOperation({
        description: 'Obtiene posts de forma paginada'
    })
    @ApiQuery({
        name: 'q',
        description: 'Texto a buscar en los posts',
        required: false
    })
    @ApiQuery({
        name: 'page',
        description: 'Página en la que queremos buscar los posts',
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
    @ApiOkResponsePaginated(PostDto)
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
        return this.postsService.get(page, size, q, sortBy, sort);
    }

    @Get('/published')
    @ApiOperation({
        description: 'Obtiene todos los posts publicados de forma paginada'
    })
    @ApiQuery({
        name: 'q',
        description: 'Texto a buscar en los posts',
        required: false
    })
    @ApiQuery({
        name: 'page',
        description: 'Página en la que queremos buscar los posts',
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
    @ApiQuery({
        name: 'category',
        description: 'Categoria del post',
        required: false
    })
    @ApiOkResponsePaginated(PostModel)
    getPublished(
        @Query('q') q: string,
        @Query('page', GreaterZeroPipe) page: number,
        @Query('size', GreaterZeroPipe) size: number,
        @Query('sortBy') sortBy: string,
        @Query('sort') sort: string,
        @Query('category') category: string
    ) {
        return this.postsService.get(page, size, q, sortBy, sort, category, true);
    }

    @Get('/:id')
    @ApiOperation({
        description: 'Obtiene un post dado un id'
    })
    @ApiParam({
        name: 'id',
        description: 'ID del post a recuperar'
    })
    @ApiResponse({
        status: 200,
        description: 'Post del ID dado',
        type: PostModel
    })
    getById(@Param('id') id: string) {
        return this.postsService.getById(id);
    }

    @Put('/:id')
    @UseInterceptors(FileInterceptor('img'))
    @ApiConsumes('multipart/form-data')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('jwt')
    @ApiOperation({
        description: 'Actualiza un post dado un id'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                content: { type: 'string' },
                categories: { type: 'string' },
                publishedDate: { type: 'string' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'ID del post a actualizar'
    })
    @ApiResponse({
        status: 200,
        type: PostModel,
        description: 'Post del id dado actualizado'
    })
    @ApiResponse({
        status: 401,
        description: `Usuario no autorizado`
    })
    @ApiResponse({
        status: 409,
        description: 'El post no existe'
    })
    updatePost(@UploadedFile() img: Express.Multer.File, @Param('id') id: string, @Body() post: PostDto) {
        return this.postsService.updatePost(id, post, img);
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(new ParseArrayPipe({ items: String, separator: ',' }))
    @ApiBearerAuth('jwt')
    @ApiOperation({
        description: 'Borra los posts dado unos ids'
    })
    @ApiQuery({
        name: 'ids',
        description: 'ids de posts a borrar separados por comas',
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
        description: 'No hay posts que borrar<br/>El post no existe'
    })
    deleteMany(@Query('ids') idsPosts: string[]) {
        return this.postsService.delete(idsPosts);
    }

}

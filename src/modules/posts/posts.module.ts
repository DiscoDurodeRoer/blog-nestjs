import { ConflictException, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Post, postSchema } from './schemas/post.schema';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: postSchema
      }
    ]),
    MulterModule.register({
      limits: {
        fieldSize: 5 * 1024 * 1024,
        fileSize: 5 * 1024 * 1024 // 10MB
      },
      fileFilter: function (req, file, cb) {
        // Solo imagenes
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
          cb(new ConflictException('Solo imagenes'), false);
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: function (req, file, cb) {
          // Destino donde lo vamos a subir
          cb(null, './images/posts/')
        },
        filename: function (req, file, cb) {

          // obtenemos el nombre del fichero
          let filenameParts = file.originalname.split('.');
          filenameParts = filenameParts.slice(0, filenameParts.length - 1);
          const filename = filenameParts.join('.');

          // Si tiene mimetype, obtenemos la extension
          if (file.mimetype) {
            const ext = file.mimetype.split('/')[1];
            cb(null, filename + '.' + ext);
          } else {
            cb(null, filename);
          }

        }
      })
    }),
    CategoriesModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostsModule { }

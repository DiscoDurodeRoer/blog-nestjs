import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PostsModule } from './modules/posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import configurationMongo from './configuration/configuration-mongo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationAuth from './configuration/configuration-auth';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: '/images',
    }),
    ConfigModule.forRoot({
      load: [configurationMongo, configurationAuth],
      isGlobal: true,
      envFilePath: `./env/${process.env.NODE_ENV}.env`
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('mongo.host')}${configService.get('mongo.port') ? ':' + configService.get('mongo.port') : ''}/${configService.get('mongo.database')}`
      })
    }),
    AuthModule,
    CategoriesModule,
    PostsModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

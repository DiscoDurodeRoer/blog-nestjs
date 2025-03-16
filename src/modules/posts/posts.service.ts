import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { PostDto } from './dto/post-dto';
import { IPage } from 'src/models/page.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PostsService {

    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>
    ) { }

    async create(post: PostDto, img?: Express.Multer.File) {

        const newPost = new this.postModel({
            ...post
        });

        await newPost.save();

        if (img) {
            const newImagePath = `./images/posts/${newPost._id.toString()}${path.extname(img.path)}`;
            fs.renameSync(img.path, newImagePath);
            await newPost.updateOne({
                img: newImagePath
            })
        }

        return this.findPostById(newPost._id.toString());

    }

    async get(page?: number, size?: number, q?: string, sortBy?: string, sort?: string, category?: string, published: boolean = false) {

        const skip = (page - 1) * size;

        const findOptions = {};

        if (category) {
            findOptions['categories'] = category
        }
        if (q) {
            findOptions['title'] = {
                $regex: q.trim(),
                $options: 'i'
            };
        }
        if (published) {
            findOptions['publishedDate'] = { $ne: null, $lt: new Date() }
        }

        // Obtiene el total de elementos
        const total = await this.postModel.countDocuments(findOptions);

        // Calculamos el total de paginas
        // Math.ceil lo que hace es devolver el numero entero mas proximo. 3.3 => 4
        const totalPages = Math.ceil(total / size);

        // Pagina siguiente y previa
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1 && page <= totalPages;
        const nextPage = hasNextPage ? page + 1 : null;
        const prevPage = hasPrevPage ? page - 1 : null;

        // Opciones de ordenacion
        const sortOptions = {};

        if (sortBy && sort) {
            switch (sort.toUpperCase()) {
                case "ASC":
                    sortOptions[sortBy] = 1;
                    break;
                case "DESC":
                    sortOptions[sortBy] = -1;
                    break;
            }
        } else if (sortBy) {
            sortOptions[sortBy] = 1;
        }

        // Obtenemos los usuarios
        const users: Post[] = await this.postModel
            .find(findOptions)
            .sort(sortOptions)
            .skip(skip)
            .limit(size)
            .populate('categories');

        // Creamos un objeto con toda la información util
        return {
            content: users,
            page,
            size,
            total,
            totalPages,
            hasNextPage,
            hasPrevPage,
            nextPage,
            prevPage
        } as IPage<Post>

    }

    getById(id: string) {
        return this.findPostById(id).populate('categories');
    }

    async updatePost(id: string, post: PostDto, img?: Express.Multer.File) {

        const postExists = await this.findPostById(id);

        if (!postExists) {
            throw new ConflictException("El post no existe");
        }

        if (!post.publishedDate) {
            post.publishedDate = null;
        }

        if (img) {
            const newImagePath = `./images/posts/${id}${path.extname(img.path)}`;
            fs.renameSync(img.path, newImagePath);
            await postExists.updateOne({
                ...post,
                img: newImagePath
            })
        } else {
            await postExists.updateOne({
                ...post
            })
        }

        return this.findPostById(id);
    }

    async delete(idsPosts: string[]) {

        if (!idsPosts || idsPosts.length == 0) {
            throw new ConflictException(`No hay posts que borrar`);
        }

        for (const idPost of idsPosts) {
            const categoryExists = await this.findPostById(idPost);
            if (!categoryExists) {
                throw new ConflictException(`El post ${idPost} no existe`);
            }
        }

        return this.postModel.deleteMany({ _id: { $in: idsPosts } })

    }

    findPostById(id: string) {
        return this.postModel.findById(id);
    }

    findPostByTitle(title: string) {
        return this.postModel.find({
            $regex: title.trim(),
            $options: 'i'
        });
    }

}

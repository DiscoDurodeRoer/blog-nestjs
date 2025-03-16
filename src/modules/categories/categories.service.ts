import { ConflictException, Injectable } from '@nestjs/common';
import { Category } from './schemas/category.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryDto } from './dto/category-dto';
import { IPage } from 'src/models/page.model';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>
    ) { }


    async create(category: CategoryDto) {

        // Buscamos si existe el permiso
        const categoryExists = await this.findCategoryByName(category.name);

        // Si existe, lanzamos excepción
        if (categoryExists) {
            throw new ConflictException("La categoria existe");
        }

        let parentId: Types.ObjectId = null;
        if (category.parent) {

            let parentExists;
            if (category.parent instanceof CategoryDto) {
                parentExists = await this.findCategoryByName(category.parent.name);
            } else {
                parentExists = await this.findCategoryById(category.parent);
            }

            if (!parentExists) {
                throw new ConflictException("La categoria padre no existe");
            }
            parentId = parentExists._id;
        }

        // Creamos una instancia del modelo
        const newCategory = new this.categoryModel({
            ...category,
            parent: parentId
        });

        return newCategory.save();

    }

    getAll() {
        return this.categoryModel.find().collation({ locale: 'en' }).sort({ order: 1, name: 1 });
    }

    async getPublic() {

        const allCategories = await this.categoryModel.find().sort({ order: 1 });

        // Crear un mapa de categorías por ID
        const categoryMap = new Map<string, any>();
        allCategories.forEach(category => {
            categoryMap.set(category._id.toString(), { ...category.toObject(), children: [] });
        });

        // Construir la estructura jerárquica
        const rootCategories = [];
        allCategories.forEach(category => {
            if (category.parent) {
                const parentCategory = categoryMap.get(category.parent.toString());
                if (parentCategory) {
                    parentCategory.children.push(categoryMap.get(category._id.toString()));
                    parentCategory.children = parentCategory.children.sort((a, b) => a.order - b.order)
                }
            } else {
                rootCategories.push(categoryMap.get(category._id.toString()));
            }
        });

        return rootCategories;
    }

    getById(id: string) {
        return this.findCategoryById(id);
    }

    async get(page: number = 1, size: number = 10, q?: string, sortBy?: string, sort?: string) {

        // Formula para el metodo skip
        const skip = (page - 1) * size;

        // Si le damos un valor a deleted, filtramos por ello
        const findOptions = {};

        if (q) {
            findOptions['name'] = {
                $regex: q.trim(),
                $options: 'i'
            }
        }

        // Obtiene el total de elementos
        const total = await this.categoryModel.countDocuments(findOptions);

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

        const categories: Category[] = await this.categoryModel
            .find(findOptions)
            .sort(sortOptions)
            .skip(skip)
            .limit(size)
            .populate('parent');

        return {
            content: categories,
            page,
            size,
            total,
            totalPages,
            hasNextPage,
            hasPrevPage,
            nextPage,
            prevPage
        } as IPage<Category>

    }

    async update(id: string, category: CategoryDto) {

        const categoryExists = await this.findCategoryById(id);

        if (categoryExists) {

            let parentId: Types.ObjectId = null;
            if (category.parent) {

                let parentExists;
                if (category.parent instanceof CategoryDto) {
                    parentExists = await this.findCategoryByName(category.parent.name);
                } else {
                    parentExists = await this.findCategoryById(category.parent);
                }

                if (!parentExists) {
                    throw new ConflictException("La categoria padre no existe");
                }
                parentId = parentExists._id;


            }
            await categoryExists.updateOne({
                ...category,
                parent: parentId
            })

            return this.categoryModel.findById(categoryExists._id);

        } else if (!categoryExists) {
            const category = new CategoryDto();
            return this.create(category);

        } else {
            throw new ConflictException("No se puede actualizar la categoria");
        }

    }

    async deleteMany(idsCategories: string[]) {

        if (!idsCategories || idsCategories.length == 0) {
            throw new ConflictException(`No hay categorias que borrar`);
        }

        for (const idCategory of idsCategories) {
            const categoryExists = await this.findCategoryById(idCategory);
            if (!categoryExists) {
                throw new ConflictException(`La categoria ${idCategory} no existe`);
            }
        }

        return this.categoryModel.deleteMany({ _id: { $in: idsCategories } })

    }

    findCategoryByName(name: string) {
        return this.categoryModel.findOne({
            name
        })
    }

    findCategoryById(id: string) {
        return this.categoryModel.findById(id).populate('parent');
    }

    findParentByName(name: string) {
        return this.categoryModel.findById({
            parent: {
                name
            }
        });
    }
}

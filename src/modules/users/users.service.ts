import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async create(user: UserDto) {

        const userExists = await this.findUserbyEmail(user.email);

        if (userExists) {
            throw new ConflictException("Existe el usuario");
        }

        const newUser = new this.userModel({
            ...user
        });

        await newUser.save();

        return this.findUserById(newUser._id.toString());

    }

    findUserbyEmail(email: string) {
        return this.userModel.findOne({ email: email.toLowerCase() })
    }

    findUserById(id: string) {
        return this.userModel.findById(id);
    }

}

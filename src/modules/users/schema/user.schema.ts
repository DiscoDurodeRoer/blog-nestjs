import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import * as bcrypt from 'bcrypt';

@Schema()
export class User {

    @Prop({ required: true, trim: true, unique: true })
    email: string;

    @Prop({ trim: true })
    password: string;

}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.pre<User>('save', async function () {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
})
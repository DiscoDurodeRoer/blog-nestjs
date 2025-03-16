import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Post {

    @Prop({ required: true, trim: true, maxlength: 100 })
    title: string;

    @Prop({ trim: true })
    content: string;

    @Prop({ default: null })
    publishedDate: Date;

    @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
    categories: Types.ObjectId[];

    @Prop()
    img: string;
}

export const postSchema = SchemaFactory.createForClass(Post);
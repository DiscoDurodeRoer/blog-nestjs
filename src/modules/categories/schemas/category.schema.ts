import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Category {

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ default: 0 })
    order: number;

    @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
    parent: Types.ObjectId;

}

export const categorySchema = SchemaFactory.createForClass(Category);
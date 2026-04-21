import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;
export const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80&auto=format&fit=crop";
export const DEFAULT_PRODUCT_CATEGORY = "General";
export const PRODUCT_STATUSES = ["draft", "active", "archived"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
export const DEFAULT_PRODUCT_STATUS: ProductStatus = "active";

@Schema({ timestamps: true, versionKey: false, collection: "products" })
export class Product {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 120 })
  name!: string;

  @Prop({ required: true, trim: true, minlength: 5, maxlength: 1000 })
  description!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, trim: true, default: DEFAULT_PRODUCT_IMAGE, maxlength: 500000 })
  image!: string;

  @Prop({ required: true, trim: true, default: DEFAULT_PRODUCT_CATEGORY, maxlength: 60 })
  category!: string;

  @Prop({ required: true, min: 0, default: 0 })
  stockQuantity!: number;

  @Prop({ required: true, enum: PRODUCT_STATUSES, default: DEFAULT_PRODUCT_STATUS })
  status!: ProductStatus;

  createdAt?: Date;

  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

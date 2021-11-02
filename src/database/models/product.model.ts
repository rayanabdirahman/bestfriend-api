import mongoose, { Schema } from 'mongoose';

export interface ProductDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  categories: mongoose.Types.ObjectId[];
  size: string;
  color: string;
  price: number;
}

const ProductSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, default: '' },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model<ProductDocument>('Product', ProductSchema);

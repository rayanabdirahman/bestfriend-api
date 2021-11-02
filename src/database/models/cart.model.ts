import mongoose from 'mongoose';

export interface CartDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  products: { id: string; quantity: number }[];
}

const CartSchema: mongoose.Schema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [{ id: { type: String }, quantity: { type: Number, default: 1 } }]
  },
  { timestamps: true }
);

export default mongoose.model<CartDocument>('Cart', CartSchema);

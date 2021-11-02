import mongoose from 'mongoose';
import { OrderStatusEnum } from '../../domain/enums/orders';

export interface OrderDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  products: { id: string; quantity: number }[];
  amount: number;
  address: unknown;
  status: OrderStatusEnum;
}

const OrderSchema: mongoose.Schema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      { id: { type: String }, quantity: { type: Number, default: 1 } }
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: OrderStatusEnum.PENDING }
  },
  { timestamps: true }
);

export default mongoose.model<OrderDocument>('Order', OrderSchema);

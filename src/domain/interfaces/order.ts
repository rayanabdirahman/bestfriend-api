import { OrderStatusEnum } from '../enums/orders';

export interface OrderProductModel {
  _id: string;
  quantity: number;
}

export interface CreateOrderModel {
  userId: string;
  products: OrderProductModel[];
  amount: number;
  address: unknown;
  status?: OrderStatusEnum;
}

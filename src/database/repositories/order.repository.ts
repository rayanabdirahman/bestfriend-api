import { injectable } from 'inversify';
import { AnalyticsReturnType } from '../../domain/interfaces/analytics';
import { CreateOrderModel } from '../../domain/interfaces/order';
import Order, { OrderDocument } from '../models/order.model';

export interface OrderRepository {
  createOne(model: CreateOrderModel): Promise<OrderDocument>;
  findOneByIdAndUpdate(
    _id: string,
    model: CreateOrderModel
  ): Promise<OrderDocument | null>;
  findOneById(_id: string): Promise<OrderDocument | null>;
  findAll(params: { userId: string } | {}): Promise<OrderDocument[]>;
  deleteOne(_id: string): Promise<OrderDocument | null>;
  aggregate(): Promise<AnalyticsReturnType[]>;
}

@injectable()
export class OrderRepositoryImpl implements OrderRepository {
  async createOne(model: CreateOrderModel): Promise<OrderDocument> {
    const order = new Order(model);
    return await order.save();
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: CreateOrderModel
  ): Promise<OrderDocument | null> {
    return await Order.findByIdAndUpdate(
      _id,
      { $set: model },
      {
        new: true
      }
    );
  }

  async findOneById(_id: string): Promise<OrderDocument | null> {
    return await Order.findOne({ _id });
  }

  async findAll(params: { userId: string } | {}): Promise<OrderDocument[]> {
    return await Order.find(params);
  }

  async deleteOne(_id: string): Promise<OrderDocument | null> {
    return await Order.findByIdAndDelete(_id);
  }

  async aggregate(): Promise<AnalyticsReturnType[]> {
    // Find a months worth of income
    const todaysDate = new Date();
    const lastMonth = new Date(todaysDate.setMonth(todaysDate.getMonth() - 1));
    const theMonthBeforeLast = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1)
    );

    return await Order.aggregate([
      { $match: { createdAt: { $gte: theMonthBeforeLast } } },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount'
        }
      },
      {
        $group: { _id: '$month', total: { $sum: '$sales' } }
      }
    ]);
  }
}

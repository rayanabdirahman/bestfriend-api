import { injectable, inject } from 'inversify';
import { OrderDocument } from '../database/models/order.model';
import { OrderRepository } from '../database/repositories/order.repository';
import { CreateOrderModel } from '../domain/interfaces/order';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface OrderService {
  createOne(model: CreateOrderModel): Promise<OrderDocument>;
  updateOneById(id: string, model: CreateOrderModel): Promise<OrderDocument>;
  findOneById(id: string): Promise<OrderDocument>;
  findAll(params: { userId: string } | {}): Promise<OrderDocument[]>;
  deleteOneById(id: string): Promise<OrderDocument>;
}

@injectable()
export class OrderServiceImpl implements OrderService {
  private orderRepository: OrderRepository;

  constructor(@inject(TYPES.OrderRepository) orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async createOne(model: CreateOrderModel): Promise<OrderDocument> {
    try {
      return await this.orderRepository.createOne(model);
    } catch (error) {
      logger.error(
        `[OrderService: createOne]: Unable to create a new order: ${error}`
      );
      throw error;
    }
  }

  async updateOneById(
    id: string,
    model: CreateOrderModel
  ): Promise<OrderDocument> {
    try {
      const order = await this.orderRepository.findOneByIdAndUpdate(id, model);
      if (!order) {
        throw new Error('Cannot update this order');
      }

      return order;
    } catch (error: any) {
      logger.error(
        `[OrderServiceImpl: updateOneById]: Unabled to update order: ${error}`
      );
      throw error;
    }
  }

  async findOneById(id: string): Promise<OrderDocument> {
    try {
      const order = await this.orderRepository.findOneById(id);
      if (!order) {
        throw new Error('Cannot find this order');
      }

      return order;
    } catch (error: any) {
      logger.error(
        `[OrderServiceImpl: findOneById]: Unabled to find order: ${error}`
      );
      throw error;
    }
  }

  async findAll(params: { userId: string } | {}): Promise<OrderDocument[]> {
    try {
      const orders = await this.orderRepository.findAll(params);
      if (!orders) {
        throw new Error('Cannot find all orders');
      }

      return orders;
    } catch (error: any) {
      logger.error(
        `[OrderServiceImpl: findAll]: Unabled to find all orders: ${error}`
      );
      throw error;
    }
  }

  async deleteOneById(id: string): Promise<OrderDocument> {
    try {
      const order = await this.orderRepository.deleteOne(id);
      if (!order) {
        throw new Error('Cannot delete this order');
      }

      return order;
    } catch (error: any) {
      logger.error(
        `[OrderServiceImpl: deleteOneById]: Unabled to delete order: ${error}`
      );
      throw error;
    }
  }
}

import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import { CreateOrderModel } from '../../domain/interfaces/order';
import AdminGuard from '../../middlewares/AdminGuard';
import AuthenticationGuard from '../../middlewares/AuthenticationGuard';
import AuthorisationGuard from '../../middlewares/AuthorisationGuard';
import { OrderService } from '../../services/order.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import OrderValidator from './order.validator';

@injectable()
export default class OrderController implements RegistrableController {
  private orderService: OrderService;

  constructor(@inject(TYPES.OrderService) orderService: OrderService) {
    this.orderService = orderService;
  }

  registerRoutes(app: express.Application): void {
    app.post(`${config.API_URL}/order`, AuthenticationGuard, this.createOne);
    app.put(
      `${config.API_URL}/order/:_id`,
      AuthenticationGuard,
      AdminGuard,
      this.updateOne
    );
    app.get(`${config.API_URL}/order/:_id`, AuthenticationGuard, this.findOne);
    app.get(
      `${config.API_URL}/order/account/:_id`,
      AuthenticationGuard,
      AuthorisationGuard,
      this.findAll
    );
    app.get(
      `${config.API_URL}/order`,
      AuthenticationGuard,
      AdminGuard,
      this.findAll
    );
    app.delete(
      `${config.API_URL}/order/:_id`,
      AuthenticationGuard,
      AdminGuard,
      this.deleteOne
    );
  }

  createOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const model: CreateOrderModel = {
        ...req.body
      };

      // validate request body
      const validity = OrderValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const order = await this.orderService.createOne(model);

      return ApiResponse.success(res, order);
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[OrderController: createOne] - Unable to create new order: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  updateOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;
      const model: CreateOrderModel = {
        ...req.body
      };

      // validate request body
      const validity = OrderValidator.updateOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const order = await this.orderService.updateOneById(_id, model);
      return ApiResponse.success(res, order);
    } catch (error: any) {
      const message = error.message || error;
      logger.error(
        `[OrderController: updateOne] - Unable to update order: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  findOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;

      const order = await this.orderService.findOneById(_id);

      return ApiResponse.success(res, order);
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[OrderController: findOne] - Unable to find order: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  findAll = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      // check if user id has been passed in params
      const params = req.params._id ? { userId: req.params._id } : {};
      const orders = await this.orderService.findAll(params);

      return ApiResponse.success(res, orders);
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[OrderController: findAll] - Unable to find all orders: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  deleteOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;

      await this.orderService.deleteOneById(_id);

      return ApiResponse.success(res, 'Order successfully deleted');
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[OrderController: deleteOne] - Unable to delete order: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}

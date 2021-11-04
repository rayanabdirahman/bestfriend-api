import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import { CreateProductModel } from '../../domain/interfaces/product';
import AdminGuard from '../../middlewares/AdminGuard';
import AuthenticationGuard from '../../middlewares/AuthenticationGuard';
import { ProductService } from '../../services/product.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import ProductValidator from './product.validator';

@injectable()
export default class ProductController implements RegistrableController {
  private productService: ProductService;

  constructor(@inject(TYPES.ProductService) productService: ProductService) {
    this.productService = productService;
  }

  registerRoutes(app: express.Application): void {
    app.post(
      `${config.API_URL}/product`,
      AuthenticationGuard,
      AdminGuard,
      this.createOne
    );
    app.put(
      `${config.API_URL}/product/:_id`,
      AuthenticationGuard,
      AdminGuard,
      this.updateOne
    );
    app.get(
      `${config.API_URL}/product/:_id`,
      AuthenticationGuard,
      AdminGuard,
      this.findOne
    );
    app.delete(
      `${config.API_URL}/product/:_id`,
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
      const model: CreateProductModel = {
        ...req.body
      };

      // validate request body
      const validity = ProductValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const product = await this.productService.createOne(model);

      return ApiResponse.success(res, product);
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[ProductController: createOne] - Unable to create new product: ${message}`
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
      const model: CreateProductModel = {
        ...req.body
      };

      // validate request body
      const validity = ProductValidator.updateOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const product = await this.productService.updateOneById(_id, model);
      return ApiResponse.success(res, product);
    } catch (error: any) {
      const message = error.message || error;
      logger.error(
        `[ProductController: updateOne] - Unable to update product: ${message}`
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

      const product = await this.productService.findOneById(_id);

      return ApiResponse.success(res, product);
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[ProductController: findOne] - Unable to find product: ${message}`
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

      await this.productService.deleteOneById(_id);

      return ApiResponse.success(res, 'Product successfully deleted');
    } catch (error: any) {
      const { message } = error;
      logger.error(
        `[ProductController: deleteOne] - Unable to delete product: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}

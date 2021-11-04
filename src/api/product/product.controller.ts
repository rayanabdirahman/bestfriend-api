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
      const validity = ProductValidator.signUp(model);
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
}

import { injectable, inject } from 'inversify';
import { ProductDocument } from '../database/models/product.model';
import { ProductRepository } from '../database/repositories/product.repository';
import { CreateProductModel } from '../domain/interfaces/product';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface ProductService {
  createOne(model: CreateProductModel): Promise<ProductDocument>;
  updateOneById(
    id: string,
    model: CreateProductModel
  ): Promise<ProductDocument>;
}

@injectable()
export class ProductServiceImpl implements ProductService {
  private productRepository: ProductRepository;

  constructor(
    @inject(TYPES.ProductRepository) productRepository: ProductRepository
  ) {
    this.productRepository = productRepository;
  }

  async createOne(model: CreateProductModel): Promise<ProductDocument> {
    try {
      return await this.productRepository.createOne(model);
    } catch (error) {
      logger.error(
        `[ProductService: createOne]: Unable to create a new product: ${error}`
      );
      throw error;
    }
  }

  async updateOneById(
    id: string,
    model: CreateProductModel
  ): Promise<ProductDocument> {
    try {
      const product = await this.productRepository.findOneByIdAndUpdate(
        id,
        model
      );
      if (!product) {
        throw new Error('Cannot update this product');
      }

      return product;
    } catch (error: any) {
      logger.error(
        `[ProductServiceImpl: updateOneById]: Unabled to update product: ${error}`
      );
      throw error;
    }
  }
}

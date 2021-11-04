import { injectable } from 'inversify';
import { CreateProductModel } from '../../domain/interfaces/product';
import Product, { ProductDocument } from '../models/product.model';

export interface ProductRepository {
  createOne(model: CreateProductModel): Promise<ProductDocument>;
}

@injectable()
export class ProductRepositoryImpl implements ProductRepository {
  async createOne(model: CreateProductModel): Promise<ProductDocument> {
    const product = new Product(model);
    return await product.save();
  }
}

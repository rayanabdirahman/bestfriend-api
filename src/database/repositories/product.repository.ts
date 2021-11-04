import { injectable } from 'inversify';
import { CreateProductModel } from '../../domain/interfaces/product';
import Product, { ProductDocument } from '../models/product.model';

export interface ProductRepository {
  createOne(model: CreateProductModel): Promise<ProductDocument>;
  findOneByIdAndUpdate(
    _id: string,
    model: CreateProductModel
  ): Promise<ProductDocument | null>;
  findOneById(_id: string): Promise<ProductDocument | null>;
  deleteOne(_id: string): Promise<ProductDocument | null>;
}

@injectable()
export class ProductRepositoryImpl implements ProductRepository {
  async createOne(model: CreateProductModel): Promise<ProductDocument> {
    const product = new Product(model);
    return await product.save();
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: CreateProductModel
  ): Promise<ProductDocument | null> {
    return await Product.findByIdAndUpdate(
      _id,
      { $set: model },
      {
        new: true
      }
    );
  }

  async findOneById(_id: string): Promise<ProductDocument | null> {
    return await Product.findOne({ _id });
  }

  async deleteOne(_id: string): Promise<ProductDocument | null> {
    return await Product.findByIdAndDelete(_id);
  }
}

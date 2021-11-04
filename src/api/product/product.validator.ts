import * as Joi from 'joi';
import { CreateProductModel } from '../../domain/interfaces/product';

export default class ProductValidator {
  static createOneSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    categories: Joi.array().items(Joi.string()).required(),
    size: Joi.string().required(),
    color: Joi.string().required(),
    price: Joi.number().required()
  });

  static signUp(model: CreateProductModel): Joi.ValidationResult {
    return this.createOneSchema.validate(model);
  }
}

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

  static updateOneSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    image: Joi.string(),
    categories: Joi.array().items(Joi.string()),
    size: Joi.string(),
    color: Joi.string(),
    price: Joi.number()
  });

  static createOne(model: CreateProductModel): Joi.ValidationResult {
    return this.createOneSchema.validate(model);
  }

  static updateOne(model: CreateProductModel): Joi.ValidationResult {
    return this.updateOneSchema.validate(model);
  }
}

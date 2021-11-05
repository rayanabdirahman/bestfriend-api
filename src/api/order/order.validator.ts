import * as Joi from 'joi';
import { CreateOrderModel } from '../../domain/interfaces/order';

const ProductItem = Joi.object().keys({
  _id: Joi.string().required(),
  quantity: Joi.number().required()
});

export default class OrderValidator {
  static createOneSchema: Joi.ObjectSchema = Joi.object({
    userId: Joi.string().required(),
    products: Joi.array().items(ProductItem).required(),
    amount: Joi.number().required(),
    address: Joi.object().required(),
    status: Joi.string()
  });

  static updateOneSchema: Joi.ObjectSchema = Joi.object({
    userId: Joi.string(),
    products: Joi.array().items(ProductItem),
    amount: Joi.number(),
    address: Joi.object(),
    status: Joi.string()
  });

  static createOne(model: CreateOrderModel): Joi.ValidationResult {
    return this.createOneSchema.validate(model);
  }

  static updateOne(model: CreateOrderModel): Joi.ValidationResult {
    return this.updateOneSchema.validate(model);
  }
}

import * as Joi from 'joi';
import { SignInModel, SignUpModel } from '../../domain/interfaces/account';

export default class AccountValidator {
  static signUpSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    avatar: Joi.string().required(),
    password: Joi.string().min(8).max(15).required(),
    isAdmin: Joi.boolean()
  });

  static signInSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).required()
  });

  static updateOneSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string(),
    username: Joi.string(),
    email: Joi.string().email(),
    avatar: Joi.string(),
    password: Joi.string().min(8).max(15),
    isAdmin: Joi.boolean()
  });

  static signUp(model: SignUpModel): Joi.ValidationResult {
    return this.signUpSchema.validate(model);
  }

  static signIn(model: SignInModel): Joi.ValidationResult {
    return this.signInSchema.validate(model);
  }

  static updateOne(model: SignUpModel): Joi.ValidationResult {
    return this.updateOneSchema.validate(model);
  }
}

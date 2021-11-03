import * as Joi from 'joi';
import { SignUpModel } from '../../domain/interfaces/account';

export default class AccountValidator {
  static signUpSchema: Joi.ObjectSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).required()
  });

  static signUp(model: SignUpModel): Joi.ValidationResult {
    return this.signUpSchema.validate(model);
  }
}

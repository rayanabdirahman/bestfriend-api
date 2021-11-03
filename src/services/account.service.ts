import { injectable, inject } from 'inversify';
import { UserDocument } from '../database/models/user.model';
import { UserRepository } from '../database/repositories/user.repository';
import { SignInModel, SignUpModel } from '../domain/interfaces/account';
import TYPES from '../types';
import CryptoHelper from '../utilities/crypto-helper';
import JwtHelper from '../utilities/jwt-helper';
import logger from '../utilities/logger';

export interface AccountService {
  signUp(model: SignUpModel): Promise<string>;
  signIn(model: SignInModel): Promise<string>;
}

@injectable()
export class AccountServiceImpl implements AccountService {
  private userRepository: UserRepository;

  constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async signUp(model: SignUpModel): Promise<string> {
    try {
      const user = await this.userRepository.createOne(model);

      // sign JWT token
      return await JwtHelper.sign(user);
    } catch (error: any) {
      if (error.code === 11000) {
        error.message = `A user with the given username or email exists`;
      }
      logger.error(
        `[AccountService: signUp]: Unabled to create a new user: ${error}`
      );
      throw error;
    }
  }

  async signIn(model: SignInModel): Promise<string> {
    try {
      // find user by email address
      const user = await this.userRepository.findOneByEmail(model.email, false);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // check if passwords match
      const doPasswordsMatch = await CryptoHelper.comparePassword(
        model.password,
        user.password
      );

      if (!doPasswordsMatch) {
        throw new Error('Invalid credentials');
      }

      // sign JWT token
      return await JwtHelper.sign(user);
    } catch (error) {
      logger.error(
        `[AccountService: signIn]: Unabled to sign in user: ${error}`
      );
      throw error;
    }
  }
}

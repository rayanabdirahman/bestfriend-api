import { injectable, inject } from 'inversify';
import { UserDocument } from '../database/models/user.model';
import { UserRepository } from '../database/repositories/user.repository';
import { SignInModel, SignUpModel } from '../domain/interfaces/account';
import TYPES from '../types';
import CryptoHelper from '../utilities/crypto-helper';
import JwtHelper from '../utilities/jwt-helper';
import logger from '../utilities/logger';

interface ReturnType {
  user: UserDocument;
  token: string;
}
export interface AccountService {
  signUp(model: SignUpModel): Promise<ReturnType>;
  signIn(model: SignInModel): Promise<ReturnType>;
  updateOneById(id: string, model: SignUpModel): Promise<UserDocument>;
}

@injectable()
export class AccountServiceImpl implements AccountService {
  private userRepository: UserRepository;

  constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async signUp(model: SignUpModel): Promise<ReturnType> {
    try {
      const user = await this.userRepository.createOne(model);

      // sign JWT token
      const token = await JwtHelper.sign(user);

      return { user, token };
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

  async signIn(model: SignInModel): Promise<ReturnType> {
    try {
      // find user by email address
      const user = await this.userRepository.findOneByEmail(model.email, false);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const { password: hashedPassword, ...rest } = user.toObject();

      // check if passwords match
      const doPasswordsMatch = await CryptoHelper.comparePassword(
        model.password,
        hashedPassword
      );

      if (!doPasswordsMatch) {
        throw new Error('Invalid credentials');
      }

      // sign JWT token
      const token = await JwtHelper.sign(user);

      return { user: rest as UserDocument, token };
    } catch (error) {
      logger.error(
        `[AccountService: signIn]: Unabled to sign in user: ${error}`
      );
      throw error;
    }
  }

  async updateOneById(id: string, model: SignUpModel): Promise<UserDocument> {
    try {
      const user = await this.userRepository.findOneByIdAndUpdate(id, model);
      if (!user) {
        throw new Error('Cannot update this user');
      }

      return user;
    } catch (error: any) {
      logger.error(
        `[AccountService: updateOneById]: Unabled to updte user: ${error}`
      );
      throw error;
    }
  }
}

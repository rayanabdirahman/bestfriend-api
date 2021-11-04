import { injectable } from 'inversify';
import { SignUpModel } from '../../domain/interfaces/account';
import User, { UserDocument } from '../models/user.model';

export interface UserRepository {
  createOne(model: SignUpModel): Promise<UserDocument>;
  findOneById(_id: string, safeguard?: boolean): Promise<UserDocument | null>;
  findOneByEmail(
    email: string,
    safeguard?: boolean
  ): Promise<UserDocument | null>;
  findOneByIdAndUpdate(
    _id: string,
    model: SignUpModel
  ): Promise<UserDocument | null>;
  findAll(): Promise<UserDocument[]>;
  deleteOne(_id: string): Promise<UserDocument | null>;
}

@injectable()
export class UserRepositoryImpl implements UserRepository {
  async createOne(model: SignUpModel): Promise<UserDocument> {
    const user = new User(model);
    // remove password before returning user document
    return await user.save().then((document) => {
      const { password: _password, ...user } = document.toObject();
      return user as UserDocument;
    });
  }

  async findOneById(
    _id: string,
    safeguard = true
  ): Promise<UserDocument | null> {
    // check if password should be returned with user document
    return safeguard
      ? await User.findOne({ _id }).select('-password -__v')
      : await User.findOne({ _id });
  }

  async findOneByEmail(
    email: string,
    safeguard = true
  ): Promise<UserDocument | null> {
    // check if password should be returned with user document
    return safeguard
      ? await User.findOne({ email }).select('-password -__v')
      : await User.findOne({ email });
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: SignUpModel
  ): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(
      _id,
      { $set: model },
      {
        new: true
      }
    ).select('-password');
  }

  async findAll(): Promise<UserDocument[]> {
    return await User.find().select('-password -__v');
  }

  async deleteOne(_id: string): Promise<UserDocument | null> {
    return await User.findByIdAndDelete(_id);
  }
}

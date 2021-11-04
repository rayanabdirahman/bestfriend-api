import mongoose from 'mongoose';
import CryptoHelper from '../../utilities/crypto-helper';

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Encrypt user password before saving
UserSchema.pre('save', function () {
  if (this.isModified('password')) {
    // hash user password
    const password = CryptoHelper.encryptPassword(this.get('password'));
    this.set({ password });
  }
});

// Encrypt user password if password is updated
UserSchema.pre('findOneAndUpdate', function (this) {
  const updates = { ...this.getUpdate() } as any;
  if (updates.$set.password) {
    this.findOneAndUpdate(
      {},
      { password: CryptoHelper.encryptPassword(this.get('password')) }
    );
  }
});

export default mongoose.model<UserDocument>('User', UserSchema);

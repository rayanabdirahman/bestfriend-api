export interface UserModel {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface JwtPayload {
  user: UserModel;
}

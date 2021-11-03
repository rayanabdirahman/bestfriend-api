export interface UserModel {
  _id: string;
  username: string;
  email: string;
}

export interface JwtPayload {
  user: UserModel;
}

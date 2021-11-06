export interface SignUpModel {
  name: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
  isAdmin?: boolean;
}

export interface SignInModel {
  email: string;
  password: string;
}

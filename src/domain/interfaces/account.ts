export interface SignUpModel {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface SignInModel {
  email: string;
  password: string;
}

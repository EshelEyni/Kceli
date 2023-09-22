export interface UserCredenitials {
  username: string;
  fullname: string;
  password: string;
  passwordConfirm: string;
  email: string;
}

export interface UserCredenitialsWithId extends UserCredenitials {
  readonly id: string;
}

export interface User {
  readonly id: string;
  username: string;
  fullname: string;
  email: string;
  bio: string;
  imgUrl: string;
  weight: number;
  height: number;
  birthday: string;
  createdAt: string;
  updatedAt: string;
}

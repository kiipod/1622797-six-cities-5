export enum UserRole {
  Default = 'Обычный',
  Pro = 'Pro'
}

export type User = {
    name: string;
    email: string;
    avatar: string;
    password: string;
    role: UserRole;
}

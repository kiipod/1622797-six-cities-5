export enum UserRole {
  Default = 'Обычный',
  Pro = 'Pro'
}

export type User = {
    name: string;
    email: string;
    avatarPath: string;
    role: UserRole;
}

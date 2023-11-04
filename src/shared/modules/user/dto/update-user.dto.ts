import { UserRole } from '../../../types/index.js';

export class UpdateUserDto {
  public name?: string;
  public avatarPath?: string;
  public role?: UserRole;
}

import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { UserRole } from '../../../types/index.js';
import { CreateUserMessages } from './create-user.messages.js';
import { MIN_NAME_LENGTH, MAX_NAME_LENGTH, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../user.constant.js';

export class CreateUserDto {
  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(MIN_NAME_LENGTH, MAX_NAME_LENGTH, { message: CreateUserMessages.name.lengthField })
  public name: string;

  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, { message: CreateUserMessages.password.lengthField })
  public password: string;

  @IsEnum(UserRole, { message: CreateUserMessages.role.invalidFormat })
  public role: UserRole;
}

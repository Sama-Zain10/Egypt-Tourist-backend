import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';
import { Locale } from '../../users/schemas/user.schema.js';

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;
const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
const normEmail = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().toLowerCase() : value);

export class RegisterDto {
  @Transform(trim) @IsString() @Length(2, 60)
  name: string;

  @Transform(normEmail) @IsEmail() @MaxLength(254)
  email: string;

  @IsString() @Length(8, 72) // 72 = bcrypt limit
  @Matches(PASSWORD_REGEX, { message: 'password must contain at least one letter and one digit' })
  password: string;

  @IsOptional() @IsEnum(Locale)
  preferredLocale?: Locale;
}

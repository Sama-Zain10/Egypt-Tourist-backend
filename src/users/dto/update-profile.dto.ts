import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayUnique, IsArray, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Locale, VisitorCategory } from '../schemas/user.schema.js';

export class UpdateProfileDto {
  @IsOptional() @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) @IsString() @Length(2, 60)
  name?: string;

  @IsOptional() @IsEnum(Locale)
  preferredLocale?: Locale;

  @IsOptional() @IsEnum(VisitorCategory)
  visitorCategory?: VisitorCategory | null;

  @IsOptional() @IsArray() @ArrayMaxSize(10) @ArrayUnique() @IsString({ each: true }) @Length(1, 50, { each: true })
  defaultInterests?: string[];
}

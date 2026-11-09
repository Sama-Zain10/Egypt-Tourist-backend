import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum Locale { EN = 'en', AR = 'ar' }
export enum VisitorCategory { EGYPTIAN = 'egyptian', FOREIGN = 'foreign', STUDENT = 'student', CHILD = 'child' }

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 60 }) name: string;

  // always lower-case (DTO transform) -> unique index is enough
  @Prop({ required: true, unique: true, lowercase: true, trim: true, maxlength: 254 }) email: string;

  @Prop({ required: true, select: false }) passwordHash: string;

  @Prop({ type: String, enum: Object.values(Locale), default: Locale.EN }) preferredLocale: Locale;

  @Prop({ type: String, enum: Object.values(VisitorCategory), default: null }) visitorCategory: VisitorCategory | null;

  @Prop({ type: [String], default: [] }) defaultInterests: string[];

  // brute-force protection: 5 failures in a row -> locked 15 min
  @Prop({ default: 0, select: false }) failedLoginCount: number;
  @Prop({ type: Date, default: null, select: false }) lockedUntil: Date | null;

  createdAt: Date;
  updatedAt: Date;
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

// _id -> id, hide internals in JSON responses
UserSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret: any) => { ret.id = String(ret._id); delete ret._id; delete ret.passwordHash; delete ret.failedLoginCount; delete ret.lockedUntil; return ret; },
});

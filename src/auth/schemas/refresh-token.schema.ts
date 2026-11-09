import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'refresh_tokens' })
export class RefreshToken {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId: Types.ObjectId;

  /** sha256 of the secret part; the raw token is never stored */
  @Prop({ required: true }) tokenHash: string;

  // Mongo deletes the document automatically once expiresAt passes (TTL index)
  @Prop({ type: Date, required: true, index: { expireAfterSeconds: 0 } }) expiresAt: Date;

  @Prop({ type: Date, default: null }) revokedAt: Date | null;
}
export type RefreshTokenDocument = HydratedDocument<RefreshToken>;
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

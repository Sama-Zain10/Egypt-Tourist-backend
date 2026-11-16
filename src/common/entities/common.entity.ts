import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VerificationStatus } from '../enums.ts';

export abstract class AppBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

/** FR-003 / FR-048 / FR-049: provenance + verification status */
export abstract class VerifiableEntity extends AppBaseEntity {
  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.DRAFT })
  status: VerificationStatus;

  @Column({ type: 'text' })
  source: string;

  @Column({ type: 'text', nullable: true })
  sourceUrl: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastVerifiedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  createdById: string | null;

  @Column({ type: 'uuid', nullable: true })
  verifiedById: string | null;

  @Column({ default: false })
  isPublished: boolean;
}
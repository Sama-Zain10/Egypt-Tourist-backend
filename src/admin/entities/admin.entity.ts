import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../common/entities/common.entity.ts';

@Entity('admins')
export class Admin extends AppBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ default: true })
  isActive: boolean;

  // FR-047: lock 15 min after 5 failed attempts, session ends after 30 min inactivity
  @Column({ type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamptz', nullable: true })
  lockedUntil: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastActivityAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;
}
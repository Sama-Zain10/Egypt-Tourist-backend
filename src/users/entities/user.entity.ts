import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Review } from '../../reviews/entities/review.entity.js';

export enum Role { USER = 'user', ADMIN = 'admin' }

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ unique: true }) email: string;
  @Column({ select: false }) password: string;
  @Column({ type: 'enum', enum: Role, default: Role.USER }) role: Role;
  @OneToMany(() => Review, (r) => r.user) reviews: Review[];
  @CreateDateColumn() createdAt: Date;
}
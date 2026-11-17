import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Place } from '../../places/entities/place.entity.js';

@Entity('governorates')
export class Governorate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  nameAr: string;

  @OneToMany(() => Place, (p) => p.governorate)
  places: Place[];
}
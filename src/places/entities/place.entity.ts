import {
  Entity,
  ManyToOne,
} from 'typeorm';

import { Governorate } from '../../governorates/entities/governorate.entity.js';

@Entity('places')
export class Place {

  @ManyToOne(
    () => Governorate,
    (governorate) => governorate.places
  )
  governorate: Governorate;

}
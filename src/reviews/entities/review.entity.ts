import {
  Entity,
  ManyToOne,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';

@Entity('reviews')
export class Review {

  @ManyToOne(
    () => User,
    (user) => user.reviews
  )
  user: User;

}
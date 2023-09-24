import { User } from './user.type.js';
import { City } from './cities.type.js';
import { HouseType } from './house.type.js';
import { Comforts } from './comforts.type.js';

export type Offer = {
  title: string;
  description: string;
  date: string | Date;
  city: City;
  preview: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  houseType: HouseType;
  rooms: number;
  guests: number;
  price: number;
  comforts: Comforts[];
  author: User;
  commentsCount?: number;
  location: {
    latitude: number;
    longitude: number;
  }
}

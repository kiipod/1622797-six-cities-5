import { User } from './user.type.js';
import { CitiesName } from './cities.type.js';
import { HouseType } from './house-type.enum.js';
import { Comforts } from './comforts.enum.js';
import { Location } from './location.type.js';

export type Offer = {
  title: string;
  description: string;
  date: string | Date;
  city: CitiesName;
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
  location: Location;
}

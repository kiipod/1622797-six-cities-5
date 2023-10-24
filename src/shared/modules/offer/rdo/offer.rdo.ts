import { Expose, Type } from 'class-transformer';
import { Comforts, HouseType, Location } from '../../../types/index.js';
import { UserRdo } from '../../user/index.js';

export class OfferRdo {
  @Expose({ name: '_id'})
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public date: string;

  @Expose()
  public city: string;

  @Expose()
  public preview: string;

  @Expose()
  public photos: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public houseType: HouseType;

  @Expose()
  public rooms: number;

  @Expose()
  public guests: number;

  @Expose()
  public price: number;

  @Expose()
  public comforts: Comforts[];

  @Expose()
  public location: Location;

  @Expose()
  public commentCount: number;

  @Expose({ name: 'authorId'})
  @Type(() => UserRdo)
  public author: UserRdo;
}

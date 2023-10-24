import { Expose } from 'class-transformer';
import { HouseType } from '../../../types/index.js';

export class OfferPreviewRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public housingType: HouseType;

  @Expose()
  public date: string;

  @Expose()
  public city: string;

  @Expose()
  public preview: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public price: number;

  @Expose()
  public commentCount: number;
}


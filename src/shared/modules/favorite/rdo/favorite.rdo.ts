import { Expose, Transform } from 'class-transformer';

export class FavoriteRdo {
  @Expose()
  @Transform(({value}) => value.toString())
  public userId: string;

  @Expose()
  @Transform(({value}) => value.toString())
  public offerId: string;
}

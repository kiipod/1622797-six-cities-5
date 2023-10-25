import { IsMongoId } from 'class-validator';
import { FavoriteMessages } from './favorite.messages.js';

export class FavoriteDto {
  @IsMongoId({ message: FavoriteMessages.offerId.invalidFormat })
  public offerId: string;

  @IsMongoId({ message: FavoriteMessages.userId.invalidFormat })
  public userId: string;
}

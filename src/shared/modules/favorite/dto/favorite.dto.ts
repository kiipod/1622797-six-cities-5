import { IsMongoId } from 'class-validator';
import { FavoriteMessages } from './favorite.messages.js';

export class FavoriteDto {
  @IsMongoId({ message: FavoriteMessages.authorId.invalidFormat })
  userId: string;

  @IsMongoId({ message: FavoriteMessages.offerId.invalidFormat })
  offerId: string;
}

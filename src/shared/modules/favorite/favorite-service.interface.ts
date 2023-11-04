import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { FavoriteDto } from './dto/favorite.dto.js';

export interface FavoriteService {
  findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  findByUserOfferId(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity>[]>;
  create(dto: FavoriteDto): Promise<DocumentType<FavoriteEntity> | null>;
  delete(dto: FavoriteDto): Promise<DocumentType<FavoriteEntity> | null>;
}

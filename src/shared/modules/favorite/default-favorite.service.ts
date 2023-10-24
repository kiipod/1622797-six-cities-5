import { DocumentType, types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { inject, injectable } from 'inversify';
import { FavoriteEntity } from './favorite.entity.js';
import { FavoriteService } from './favorite-service.interface.js';
import { FavoriteDto } from './dto/favorite.dto.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) {}

  // Метод отвечает за поиск Избранных объявлений у конкретного пользователя
  public async findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]> {
    return await this.favoriteModel
      .find({ userId })
      .exec();
  }

  // Метод отвечает за поиск у пользователя текущего предложения
  public async findByUserOfferId(dto: FavoriteDto): Promise<DocumentType<FavoriteEntity>[]> {
    return await this.favoriteModel
      .find({ dto })
      .exec();
  }

  // Метод отвечает за добавление в избранное объявления
  public async createFavorite(dto: FavoriteDto): Promise<DocumentType<FavoriteEntity> | null> {
    return await this.favoriteModel.create(dto);
  }

  // Метод отвечает за удаление из Избранного конкретного объявления
  public async deleteFavorite(dto: FavoriteDto): Promise<DocumentType<FavoriteEntity> | null> {
    return await this.favoriteModel.findOneAndDelete(dto).exec();
  }
}

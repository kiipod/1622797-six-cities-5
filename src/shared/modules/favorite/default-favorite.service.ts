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

  // Метод отвечает за добавление/удаление из Избранного конкретного объявления
  public async createOrDelete(dto: FavoriteDto): Promise<DocumentType<FavoriteEntity> | null> {
    const isExistFavoriteEntity = await this.favoriteModel.exists(dto) !== null;
    if (isExistFavoriteEntity) {
      return await this.favoriteModel.create(dto);
    } else {
      return await this.favoriteModel.findOneAndDelete(dto).exec();
    }
  }
}

import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_PREMIUM_OFFER } from './offer.constant.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  // Агрегация комментариев и рейтинга объявления
  private commentsLookup = [
    {
      $lookup: {
        from: 'comments',
        let: { offerId: '$_id' },
        pipeline: [ { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } } ],
        as: 'comments',
      },
    },
    {
      $addFields: {
        rating: { $avg: '$comments.grade' },
        commentsCount: { $size: '$comments' }
      },
    },
    { $unset: 'comments' }
  ];

  // Агрегация избранных объявлений пользователя
  private favoritesLookup = [
    {
      $lookup: {
        from: 'favorites',
        let: { offerId: '$_id', userId: 'userId' },
        pipeline: [ { $match: { $expr: { $and: [
          { $eq: ['$$offerId', '$$offerId'] },
          { $eq: [ '$userId', '$$userId' ] }
        ] } } } ],
        as: 'favorites',
      },
    },
    { $addFields: { isFavorite: { $toBool: { $size: '$favorites' } } } },
    { $unset: 'favorites' }
  ];

  // Метод отвечает за создание нового объявления
  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  // Метод отвечает за поиск объявления по id
  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: offerId }],
            },
          },
        },
        ...this.commentsLookup,
        ...this.favoritesLookup
      ])
      .exec()
      .then(([result]) => result ?? null);
  }

  // Метод отвечает за удаление объявления по id
  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  // Метод отвечает за показ списка объявлений
  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    return this.offerModel
      .aggregate([
        ...this.commentsLookup,
        ...this.favoritesLookup,
        { $project: { title: 1, date: 1, city: 1, houseType: 1, price: 1, preview: 1, isPremium: 1 } },
        { $sort: { createdAt: SortType.Down } },
        { $limit: limit }
      ])
      .exec();
  }

  // Метод отвечает за обновление объявления по id
  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate('userId')
      .exec();
  }

  // Метод отвечает за поиск Премиальных предложений конкретного города
  public async findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {
          $match: {
            $and: [{ isPremium: true }, { city: city }],
          },
        },
        ...this.commentsLookup,
        ...this.favoritesLookup,
        { $project: { title: 1, date: 1, city: 1, houseType: 1, price: 1, preview: 1 } },
        { $limit: DEFAULT_PREMIUM_OFFER },
        { $sort: { createdAt: SortType.Down } },
      ])
      .exec();
  }

  // Метод отвечает за нахождение текущей записи в БД
  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }
}

import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_PREMIUM_OFFER } from './offer.constant.js';
import { commentsPipeline, defaultFavoritePipeline, favoritesPipeline, authorPipeline } from './offer.aggregation.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  // Метод отвечает за показ списка объявлений
  public async find(count?: number, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    const aggregate = userId ?
      [...commentsPipeline, ...favoritesPipeline(userId)] :
      [...commentsPipeline, ...defaultFavoritePipeline];
    return this.offerModel
      .aggregate([
        ...aggregate,
        { $project: { title: 1, date: 1, city: 1, houseType: 1, price: 1, preview: 1, isPremium: 1 } },
        { $sort: { createdAt: SortType.Down } },
        { $limit: limit }
      ])
      .exec();
  }

  // Метод отвечает за поиск объявления по id
  public async findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const aggregate = userId ?
      [...commentsPipeline, ...favoritesPipeline(userId), ...authorPipeline] :
      [...commentsPipeline, ...defaultFavoritePipeline, ...authorPipeline];
    return this.offerModel
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: offerId }],
            },
          },
        },
        ...aggregate,
      ])
      .exec()
      .then(([result]) => result ?? null);
  }

  // Метод отвечает за создание нового объявления
  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  // Метод отвечает за удаление объявления по id
  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  // Метод отвечает за обновление объявления по id
  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .exec();
  }

  // Метод отвечает за поиск Премиальных предложений конкретного города
  public async findPremiumByCity(city: string, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const aggregate = userId ?
      [...commentsPipeline, ...favoritesPipeline(userId)] :
      [...commentsPipeline, ...defaultFavoritePipeline];
    return this.offerModel
      .aggregate([
        {
          $match: {
            $and: [{ isPremium: true }, { city: city }],
          },
        },
        ...aggregate,
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

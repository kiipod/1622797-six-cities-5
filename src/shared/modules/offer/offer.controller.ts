import { inject } from 'inversify';
import {
  BaseController,
  HttpMethod,
  ValidateObjectIdMiddleware,
  DocumentExistsMiddleware,
  ValidateDtoMiddleware,
  ValidateCityMiddleware
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { CreateOfferRequest, ParamCityName, ParamOfferId, DefaultOfferService, UpdateOfferDto } from './index.js';
import { OfferRdo, OfferPreviewRdo } from './rdo/index.js';
import { CommentService, CommentRdo } from '../comment/index.js';
import { CreateOfferDto } from './index.js';

export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.find });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.findById,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.updateById,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto)
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteById,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/premium/:cityName',
      method: HttpMethod.Get,
      handler: this.getPremium,
      middlewares: [
        new ValidateCityMiddleware('cityName')
      ]
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  // Метод отвечает за создание нового предложения
  public async create({body}: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    const newOffer = await this.offerService.findById(result.id);

    this.created(res, fillDTO(OfferRdo, newOffer));
  }

  // Метод отвечает за показ списка предложений
  public async find(_req: Request, res: Response): Promise<void> {
    const result = await this.offerService.find();

    this.ok(res,fillDTO(OfferPreviewRdo, result));
  }

  // Метод отвечает за показ всей информации по выбранному предложению
  public async findById({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const existOffer = await this.offerService.findById(offerId);

    this.ok(res, fillDTO(OfferRdo, existOffer));
  }

  // Метод отвечает за обновления конкретного предложения
  public async updateById({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const { offerId } = params;
    const updatedOffer = await this.offerService.updateById(offerId, body);

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  // Метод отвечает за удаление конкретного предложения
  public async deleteById({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, {});
  }

  // Метод отвечает за поиск премиальных предложений в выбранном городе
  public async getPremium({ params }: Request<ParamCityName>, res: Response): Promise<void> {
    const { cityName } = params;
    const premium = await this.offerService.findPremiumByCity(cityName);

    this.ok(res, fillDTO(OfferPreviewRdo, premium));
  }

  // Метод отвечает за получение комментариев конкретного предложения
  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const comments = await this.commentService.findByOfferId(offerId);

    this.ok(res, fillDTO(CommentRdo, comments));
  }
}

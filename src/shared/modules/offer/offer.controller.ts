import { inject } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpMethod,
  ValidateObjectIdMiddleware,
  DocumentExistsMiddleware,
  ValidateDtoMiddleware,
  ValidateCityMiddleware,
  PrivateRouteMiddleware, HttpError,
  UploadFileMiddleware
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { CreateOfferRequest, ParamCityName, ParamOfferId, DefaultOfferService, UpdateOfferDto } from './index.js';
import { OfferRdo, OfferPreviewRdo } from './rdo/index.js';
import { CommentService, CommentRdo } from '../comment/index.js';
import { CreateOfferDto } from './index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { UploadImageRdo } from './rdo/upload-image.rdo.js';

export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
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
        new PrivateRouteMiddleware(),
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
        new PrivateRouteMiddleware(),
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

    this.addRoute({
      path: '/:offerId/photos',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'photos'),
      ]
    });
  }

  // Метод отвечает за показ списка предложений
  public async find({ query, tokenPayload }: Request, res: Response): Promise<void> {
    const count = Number(query);
    const result = await this.offerService.find(count, tokenPayload?.id);

    this.ok(res,fillDTO(OfferPreviewRdo, result));
  }

  // Метод отвечает за показ всей информации по выбранному предложению
  public async findById({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const existOffer = await this.offerService.findById(offerId, tokenPayload?.id);

    this.ok(res, fillDTO(OfferRdo, existOffer));
  }

  // Метод отвечает за создание нового предложения
  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({ ...body, authorId: tokenPayload.id });
    const newOffer = await this.offerService.findById(result.id);

    this.created(res, fillDTO(OfferRdo, newOffer));
  }

  // Метод отвечает за обновления конкретного предложения
  public async updateById({ body, params, tokenPayload }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const { offerId } = params;
    const currentOffer = await this.offerService.findById(offerId);

    if (currentOffer && currentOffer.authorId.toString() !== tokenPayload.id) {
      throw new HttpError(StatusCodes.METHOD_NOT_ALLOWED, 'Only the author has the right to change the offer');
    }

    const updatedOffer = await this.offerService.updateById(offerId, body);

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  // Метод отвечает за удаление конкретного предложения
  public async deleteById({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const currentOffer = await this.offerService.findById(offerId);

    if (currentOffer && currentOffer.authorId.toString() !== tokenPayload.id) {
      throw new HttpError(StatusCodes.METHOD_NOT_ALLOWED, 'Only the author has the right to delete the offer');
    }

    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, {});
  }

  // Метод отвечает за поиск премиальных предложений в выбранном городе
  public async getPremium({ params, tokenPayload }: Request<ParamCityName>, res: Response): Promise<void> {
    const { cityName } = params;
    const premium = await this.offerService.findPremiumByCity(cityName, tokenPayload?.id);

    this.ok(res, fillDTO(OfferPreviewRdo, premium));
  }

  // Метод отвечает за получение комментариев конкретного предложения
  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const comments = await this.commentService.findByOfferId(offerId);

    this.ok(res, fillDTO(CommentRdo, comments));
  }

  // Метод отвечает за загрузку фотографий к предложению
  public async uploadImage({ params, file } : Request<ParamOfferId>, res: Response) {
    const { offerId } = params;
    const updateDto = { photos: file?.filename };
    await this.offerService.updateById(offerId, updateDto);

    this.created(res, fillDTO(UploadImageRdo, updateDto));
  }
}

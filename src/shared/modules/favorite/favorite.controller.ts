import { inject } from 'inversify';
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import {
  DefaultFavoriteService,
  CreateFavoriteRequest,
  DeleteFavoriteRequest,
  FavoriteRdo,
  FavoriteDto
} from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { StatusCodes } from 'http-status-codes';
import { DefaultOfferService } from '../offer/index.js';

export class FavoriteController extends BaseController {
  constructor(
        @inject(Component.Logger) protected readonly logger: Logger,
        @inject(Component.FavoriteService) private readonly favoriteService: DefaultFavoriteService,
        @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new PrivateRouteMiddleware()
      ]});

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(FavoriteDto)
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(FavoriteDto)
      ]
    });
  }

  // Метод отвечает за поиск всех избранных предложений у пользователя
  public async index({ tokenPayload }: Request, res: Response): Promise<void> {
    const userFavorites = await this.favoriteService.findByUserId(tokenPayload.id);
    const responseData = fillDTO(FavoriteRdo , userFavorites);

    this.ok(res, responseData);
  }

  // Метод отвечает за добавление предложения в список избранных
  public async create({ body, tokenPayload }: CreateFavoriteRequest, res: Response): Promise<void> {
    const existsUserOffer = await this.favoriteService.findByUserOfferId(tokenPayload.id, body.offerId);

    if (existsUserOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with favorite offer «${body.offerId}» exists.`,
        'UserController'
      );
    }

    const result = await this.favoriteService.create({ ...body, userId: tokenPayload.id });
    this.created(res, fillDTO(FavoriteRdo, result));
  }

  // Метод отвечает за удаление предложения из списка избранных
  public async delete({ body, tokenPayload }: DeleteFavoriteRequest, res: Response): Promise<void> {
    const existsUserOffer = await this.favoriteService.findByUserOfferId(tokenPayload.id, body.offerId);

    if (!existsUserOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with favorite offer «${body.offerId}» not exists.`,
        'UserController'
      );
    }

    await this.favoriteService.delete({ ...body, userId: tokenPayload.id });
    this.noContent(res, null);
  }
}

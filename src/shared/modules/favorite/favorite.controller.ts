import { inject } from 'inversify';
import {BaseController, HttpError, HttpMethod} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { DefaultFavoriteService, CreateFavoriteRequest, DeleteFavoriteRequest, FavoriteRdo } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { StatusCodes } from 'http-status-codes';

export class FavoriteController extends BaseController {
  constructor(
        @inject(Component.Logger) protected readonly logger: Logger,
        @inject(Component.FavoriteService) private readonly favoriteService: DefaultFavoriteService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController…');

    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/favorite/:offerId/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/favorite/:offerId/', method: HttpMethod.Delete, handler: this.destroy });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    // проверка пользователя
    const userId = '785578ywrw3yf4w';
    const userFavorites = await this.favoriteService.findByUserId(userId);
    const responseData = fillDTO(FavoriteRdo , userFavorites);
    this.ok(res, responseData);
  }

  public async create({ body }: CreateFavoriteRequest, res: Response): Promise<void> {
    // проверка объявления у пользователя
    const existsUserOffer = await this.favoriteService.findByUserOfferId(body);

    if (existsUserOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with favorite offer «${body.offerId}» exists.`,
        'UserController'
      );
    }

    const result = await this.favoriteService.createFavorite(body);
    this.created(res, fillDTO(FavoriteRdo, result));
  }

  public async destroy({ body }: DeleteFavoriteRequest, res: Response): Promise<void> {
    // проверка объявления у пользователя
    const existsUser = await this.favoriteService.findByUserOfferId(body);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with favorite offer «${body.offerId}» exists.`,
        'UserController'
      );
    }

    await this.favoriteService.deleteFavorite(body);
    this.noContent(res, null);
  }
}

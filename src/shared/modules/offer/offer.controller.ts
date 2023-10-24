import { inject } from 'inversify';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { HttpError } from '../../libs/rest/index.js';
import { CreateOfferRequest, ParamCityName, ParamOfferId, DefaultOfferService, UpdateOfferDto } from './index.js';
import { OfferRdo, OfferPreviewRdo } from './rdo/index.js';

export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/:id', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.find });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.findById });
    this.addRoute({ path: '/:id', method: HttpMethod.Put, handler: this.updateById });
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.deleteById });
    this.addRoute({ path: '/premium/:cityName', method: HttpMethod.Get, handler: this.findPremium });
  }

  public async create({body}: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    const newOffer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, newOffer));
  }

  public async find(_req: Request, res: Response): Promise<void> {
    const result = await this.offerService.find();
    this.ok(res,fillDTO(OfferPreviewRdo, result));
  }

  public async findById({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const existOffer = await this.offerService.findById(offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${offerId}» not exists.`,
        'OfferController'
      );
    }
    this.ok(res, fillDTO(OfferRdo, existOffer));
  }

  public async updateById({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const { offerId } = params;
    const existOffer = await this.offerService.findById(offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${offerId}» not exists.`,
        'OfferController'
      );
    }
    const updatedOffer = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async deleteById({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const existOffer = await this.offerService.deleteById(offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${offerId}» not exists.`,
        'OfferController'
      );
    }
    this.noContent(res, {});
  }

  public async findPremium({ params }: Request<ParamCityName>, res: Response): Promise<void> {
    const premium = await this.offerService.findPremiumByCity(params.cityName);
    this.ok(res, fillDTO(OfferPreviewRdo, premium));
  }
}

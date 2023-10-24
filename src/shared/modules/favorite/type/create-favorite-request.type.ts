import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { FavoriteDto } from '../dto/favorite.dto.js';

export type CreateFavoriteRequest = Request<RequestParams, RequestBody, FavoriteDto>;

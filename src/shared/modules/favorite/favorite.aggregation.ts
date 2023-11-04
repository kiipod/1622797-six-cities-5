import mongoose from 'mongoose';
import { SortType } from '../../types/index.js';

// Агрегация количества комментариев и рейтинга
export const commentsPipeline = [
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
export const favoritesPipeline = (userId: string) => ([
  {
    $lookup: {
      from: 'favorites',
      let: { offerId: '$_id' },
      pipeline: [ { $match: { $expr: { $and: [
        { $eq: ['$$offerId', '$$offerId'] },
        { $eq: [ new mongoose.Types.ObjectId(userId), '$userId' ] }
      ] } } } ],
      as: 'favorites',
    },
  },
  { $addFields: { isFavorite: { $toBool: { $size: '$favorites' } } } },
  { $unset: 'favorites' }
]);

export const offerPipeline = ([
  {
    $lookup: {
      from: 'offers',
      let: { offerId: '$offerId' },
      pipeline: [
        { $match:
              { $expr:
                    { $eq: [ '$_id', '$$offerId' ] },
              }
        },
      ],
      as: 'offer'
    }
  },
  { $project: { title: 1, date: 1, city: 1, houseType: 1, price: 1, preview: 1, isPremium: 1 } },
  { $sort: { createdAt: SortType.Down } },
  { $unset: ['offers'] }
]);

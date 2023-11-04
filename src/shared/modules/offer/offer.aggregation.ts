import mongoose from 'mongoose';

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

export const defaultFavoritePipeline = [
  { $addFields:
      { isFavorite: false }
  }
];

export const authorPipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'authorId',
      foreignField: '_id',
      as: 'users',
    },
  },
  {
    $addFields: {
      author: { $arrayElemAt: ['$users', 0] },
    },
  },
  { $project: { _id: 0 } },
  {
    $unset: ['users'],
  },
];

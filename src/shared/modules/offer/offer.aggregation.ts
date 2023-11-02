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
export const favoritesPipeline = [
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
  {
    $unset: ['users'],
  },
];

export const finalPipeline = [
  {
    $project: {
      _id: 0,
      id: { $toString: '$_id' },
      author: 1,
      city: 1,
      commentsCount: { $size: '$comments' },
      rating: { $ifNull: [{ $avg: '$comments.grade' }, 0] },
      isFavorite: { $in: ['$_id', { $ifNull: ['$user.favorites', []] }] },
      preview: { $arrayElemAt: ['$images', 0] },
      date: 1,
      isPremium: 1,
      price: 1,
      title: 1,
      description: 1,
      location: 1,
      photos: 1,
      comforts: 1,
      houseType: 1,
      rooms: 1,
      guests: 1
    },
  },
];

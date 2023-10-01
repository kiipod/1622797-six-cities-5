import { Offer, UserRole, CitiesName, Comforts, HouseTypeEnum } from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    date,
    city,
    preview,
    photos,
    isPremium,
    isFavorite,
    rating,
    houseType,
    rooms,
    guests,
    price,
    comforts,
    name,
    email,
    avatar,
    password,
    role,
    latitude,
    longitude
  ] = offerData.replace('\n', '').split('\t');

  return {
    title: title,
    description: description,
    date: new Date(date),
    city: { name: CitiesName[city as keyof typeof CitiesName] },
    preview: preview,
    photos: photos.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: Number.parseInt(rating, 10),
    houseType: HouseTypeEnum[houseType as keyof typeof HouseTypeEnum],
    rooms: Number.parseInt(rooms, 10),
    guests: Number.parseInt(guests, 10),
    price: Number.parseInt(price, 10),
    comforts: comforts.split(';').map((comfort) => Comforts[comfort as keyof typeof Comforts]),
    author: {
      name: name,
      email: email,
      avatar: avatar,
      password: password,
      role: UserRole[role as keyof typeof UserRole],
    },
    location: {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude),
    }
  } as Offer;
}

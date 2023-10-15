import { Offer, UserRole, CitiesName, Comforts, HouseType } from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    date,
    city,
    preview,
    photos,
    isPremium,
    houseType,
    rooms,
    guests,
    price,
    comforts,
    name,
    email,
    avatarPath,
    role,
    latitude,
    longitude
  ] = offerData.replace('\n', '').split('\t');

  return {
    title: title,
    description: description,
    date: new Date(date),
    city: CitiesName[city as keyof typeof CitiesName],
    preview: preview,
    photos: photos.split(';'),
    isPremium: isPremium === 'true',
    houseType: HouseType[houseType as keyof typeof HouseType],
    rooms: Number.parseInt(rooms, 10),
    guests: Number.parseInt(guests, 10),
    price: Number.parseInt(price, 10),
    comforts: comforts.split(';').map((comfort) => Comforts[comfort as keyof typeof Comforts]),
    author: {
      name: name,
      email: email,
      avatarPath: avatarPath,
      role: UserRole[role as keyof typeof UserRole],
    },
    location: { latitude, longitude }
  } as Offer;
}

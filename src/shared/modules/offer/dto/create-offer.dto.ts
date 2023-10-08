import { CitiesName, Comforts, HouseType, Location } from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public date: Date;
  public city: CitiesName;
  public preview: string;
  public photos: string[];
  public isPremium: boolean;
  public rating: number;
  public houseType: HouseType;
  public rooms: number;
  public guests: number;
  public price: number;
  public comforts: Comforts[];
  public authorId: string;
  public location: Location;
}

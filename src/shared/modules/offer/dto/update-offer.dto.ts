import { CitiesName, Comforts, HouseType, Location } from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: CitiesName;
  public preview?: string;
  public photos?: string[];
  public isPremium?: boolean;
  public houseType?: HouseType;
  public rooms?: number;
  public guests?: number;
  public price?: number;
  public comforts?: Comforts[];
  public location?: Location;
}

import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { CitiesName, Comforts, HouseType, Location } from '../../../types/index.js';
import {
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_FILENAME_LENGTH,
  MIN_ROOMS_VALUE,
  MAX_ROOMS_VALUE,
  MIN_GUESTS_VALUE,
  MAX_GUESTS_VALUE,
  MIN_PRICE_VALUE,
  MAX_PRICE_VALUE
} from '../offer.constant.js';

export class CreateOfferDto {
  @MinLength(MIN_TITLE_LENGTH, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(MAX_TITLE_LENGTH, { message: CreateOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(MIN_DESCRIPTION_LENGTH, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(MAX_DESCRIPTION_LENGTH, { message: CreateOfferValidationMessage.description.maxLength })
  public description: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.date.invalidFormat })
  public date: Date;

  @IsEnum(CitiesName, { message: CreateOfferValidationMessage.city.invalid })
  public city: CitiesName;

  @MaxLength(MAX_FILENAME_LENGTH, { message: CreateOfferValidationMessage.photos.maxLength })
  public preview: string;

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(HouseType, { message: CreateOfferValidationMessage.houseType.invalid })
  public houseType: HouseType;

  @IsInt({ message: CreateOfferValidationMessage.rooms.invalidFormat })
  @Min(MIN_ROOMS_VALUE, { message: CreateOfferValidationMessage.rooms.minValue })
  @Max(MAX_ROOMS_VALUE, { message: CreateOfferValidationMessage.rooms.maxValue })
  public rooms: number;

  @IsInt({ message: CreateOfferValidationMessage.guests.invalidFormat })
  @Min(MIN_GUESTS_VALUE, { message: CreateOfferValidationMessage.guests.minValue })
  @Max(MAX_GUESTS_VALUE, { message: CreateOfferValidationMessage.guests.maxValue })
  public guests: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(MIN_PRICE_VALUE, { message: CreateOfferValidationMessage.price.minValue })
  @Max(MAX_PRICE_VALUE, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.comforts.invalidFormat })
  @IsEnum(Comforts, { each: true, message: CreateOfferValidationMessage.comforts.invalid })
  public comforts: Comforts[];

  public authorId: string;

  @ValidateNested({message: CreateOfferValidationMessage.location.invalidFormat})
  public location: Location;
}

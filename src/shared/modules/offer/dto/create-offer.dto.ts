import {
  ArrayMaxSize,
  ArrayMinSize,
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

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.date.invalidFormat })
  public date: Date;

  @IsEnum(CitiesName, { message: CreateOfferValidationMessage.city.invalid })
  public city: CitiesName;

  @MaxLength(256, { message: CreateOfferValidationMessage.photos.maxLength })
  public preview: string;

  @IsArray({ message: CreateOfferValidationMessage.photos.invalidFormat })
  @MaxLength(256, { message: CreateOfferValidationMessage.photos.maxLength })
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.photos.invalidSize })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.photos.invalidSize })
  public photos: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(HouseType, { message: CreateOfferValidationMessage.houseType.invalid })
  public houseType: HouseType;

  @IsInt({ message: CreateOfferValidationMessage.rooms.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.rooms.minValue })
  @Max(8, { message: CreateOfferValidationMessage.rooms.maxValue })
  public rooms: number;

  @IsInt({ message: CreateOfferValidationMessage.guests.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.guests.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guests.maxValue })
  public guests: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.comforts.invalidFormat })
  @IsEnum(Comforts, { each: true, message: CreateOfferValidationMessage.comforts.invalid })
  public comforts: Comforts[];

  public authorId: string;

  @ValidateNested({message: CreateOfferValidationMessage.location.invalidFormat})
  public location: Location;
}

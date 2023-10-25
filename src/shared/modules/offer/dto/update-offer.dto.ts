import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { UpdateOfferValidationMessage } from './update-offer.messages.js';
import { CitiesName, Comforts, HouseType, Location } from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: UpdateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: UpdateOfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: UpdateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: UpdateOfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsEnum(CitiesName, { message: UpdateOfferValidationMessage.city.invalid })
  public city?: CitiesName;

  @IsOptional()
  @MaxLength(256, { message: UpdateOfferValidationMessage.preview.maxLength })
  public preview?: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.photos.invalidFormat })
  @MaxLength(256, { message: UpdateOfferValidationMessage.photos.maxLength })
  @ArrayMinSize(6, { message: UpdateOfferValidationMessage.photos.invalidSize })
  @ArrayMaxSize(6, { message: UpdateOfferValidationMessage.photos.invalidSize })
  public photos?: string[];

  @IsOptional()
  @IsBoolean({ message: UpdateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HouseType, { message: UpdateOfferValidationMessage.houseType.invalid })
  public houseType?: HouseType;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.rooms.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.rooms.minValue })
  @Max(8, { message: UpdateOfferValidationMessage.rooms.maxValue })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.guests.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.guests.minValue })
  @Max(10, { message: UpdateOfferValidationMessage.guests.maxValue })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: UpdateOfferValidationMessage.price.minValue })
  @Max(100000, { message: UpdateOfferValidationMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.comforts.invalidFormat })
  @IsEnum(Comforts, { each: true, message: UpdateOfferValidationMessage.comforts.invalid })
  public comforts?: Comforts[];

  @IsOptional()
  @ValidateNested({message: CreateOfferValidationMessage.location.invalidFormat})
  public location?: Location;
}

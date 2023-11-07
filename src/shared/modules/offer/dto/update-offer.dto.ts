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
  MAX_PRICE_VALUE,
  PHOTOS_COUNT_LENGTH
} from '../offer.constant.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(MIN_TITLE_LENGTH, { message: UpdateOfferValidationMessage.title.minLength })
  @MaxLength(MAX_TITLE_LENGTH, { message: UpdateOfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(MIN_DESCRIPTION_LENGTH, { message: UpdateOfferValidationMessage.description.minLength })
  @MaxLength(MAX_DESCRIPTION_LENGTH, { message: UpdateOfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsEnum(CitiesName, { message: UpdateOfferValidationMessage.city.invalid })
  public city?: CitiesName;

  @IsOptional()
  @MaxLength(MAX_FILENAME_LENGTH, { message: UpdateOfferValidationMessage.preview.maxLength })
  public preview?: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.photos.invalidFormat })
  @MaxLength(MAX_FILENAME_LENGTH, { message: UpdateOfferValidationMessage.photos.maxLength })
  @ArrayMinSize(PHOTOS_COUNT_LENGTH, { message: UpdateOfferValidationMessage.photos.invalidSize })
  @ArrayMaxSize(PHOTOS_COUNT_LENGTH, { message: UpdateOfferValidationMessage.photos.invalidSize })
  public photos?: string;

  @IsOptional()
  @IsBoolean({ message: UpdateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HouseType, { message: UpdateOfferValidationMessage.houseType.invalid })
  public houseType?: HouseType;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.rooms.invalidFormat })
  @Min(MIN_ROOMS_VALUE, { message: UpdateOfferValidationMessage.rooms.minValue })
  @Max(MAX_ROOMS_VALUE, { message: UpdateOfferValidationMessage.rooms.maxValue })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.guests.invalidFormat })
  @Min(MIN_GUESTS_VALUE, { message: UpdateOfferValidationMessage.guests.minValue })
  @Max(MAX_GUESTS_VALUE, { message: UpdateOfferValidationMessage.guests.maxValue })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.price.invalidFormat })
  @Min(MIN_PRICE_VALUE, { message: UpdateOfferValidationMessage.price.minValue })
  @Max(MAX_PRICE_VALUE, { message: UpdateOfferValidationMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.comforts.invalidFormat })
  @IsEnum(Comforts, { each: true, message: UpdateOfferValidationMessage.comforts.invalid })
  public comforts?: Comforts[];

  @IsOptional()
  @ValidateNested({message: CreateOfferValidationMessage.location.invalidFormat})
  public location?: Location;
}

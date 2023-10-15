import { defaultClasses, getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { CitiesName, Comforts, HouseType, Location } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 100,
  })
  public title: string;

  @prop({
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 1024,
  })
  public description: string;

  @prop({ required: true })
  public date: Date;

  @prop({
    required: true,
    type: () => String,
    enum: CitiesName
  })
  public city: CitiesName;

  @prop({ required: true })
  public preview: string;

  @prop({
    required: true,
    type: [String]
  })
  public photos: string[];

  @prop({ required: true })
  public isPremium: boolean;

  @prop({
    required: true,
    type: () => String,
    enum: HouseType
  })
  public houseType: HouseType;

  @prop({
    required: true,
    min: 1,
    max: 8,
  })
  public rooms: number;

  @prop({
    required: true,
    min: 1,
    max: 10,
  })
  public guests: number;

  @prop({
    required: true,
    min: 100,
    max: 100000,
  })
  public price: number;

  @prop({
    required: true,
    type: () => String,
    default: [],
    enum: Comforts
  })
  public comforts: Comforts[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public authorId: Ref<UserEntity>;

  @prop({
    required: true
  })
  public location: Location;
}

export const OfferModel = getModelForClass(OfferEntity);

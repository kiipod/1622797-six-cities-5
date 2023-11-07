import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { CreateCommentMessages } from './create-comment.messages.js';
import { MIN_TEXT_LENGTH, MAX_TEXT_LENGTH, MAX_GRADE_VALUE, MIN_GRADE_VALUE } from '../comment.constant.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.invalidFormat })
  @Length(MIN_TEXT_LENGTH, MAX_TEXT_LENGTH, { message: 'min is 5, max is 1024 '})
  public text: string;

  @IsInt({ message: CreateCommentMessages.grade.invalidFormat })
  @Min(MIN_GRADE_VALUE, { message: CreateCommentMessages.grade.minValue })
  @Max(MAX_GRADE_VALUE, { message: CreateCommentMessages.grade.maxValue })
  public grade: number;

  @IsMongoId({ message: CreateCommentMessages.offerId.invalidFormat })
  public offerId: string;

  public authorId: string;
}

import { IsUUID } from 'class-validator';

export class UnlikeDto {
  @IsUUID()
  postId: string;
}

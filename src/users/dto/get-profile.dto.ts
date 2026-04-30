import { Expose } from "class-transformer";

export class ProfileResponseDto {
  @Expose()
  bio: string;

  @Expose()
  contact: string;
}

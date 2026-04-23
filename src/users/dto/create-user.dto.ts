export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  is_active?: boolean;
}

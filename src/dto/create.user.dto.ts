export class CreateUserDto {
  name: string;
  email: string;
  phoneNumber: string | null;
  roleId: string;
  password: string;
}

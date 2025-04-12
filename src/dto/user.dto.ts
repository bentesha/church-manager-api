export class CreateUserDto {
  name: string;
  email: string;
  phoneNumber: string | null;
  roleId: string;
  password: string;
  sendEmail?: boolean;
}

export class UpdateUserDto {
  name?: string;
  phoneNumber?: string;
  isActive?: boolean;
  roleId?: string;
  password?: string;
  sendEmail?: boolean;
}

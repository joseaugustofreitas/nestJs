import { IsEmail} from 'class-validator';
import { CreateUserDTO } from 'src/user/dto/create-users.dto';

export class AuthForgetDTO{
  @IsEmail()
  email: string;

}

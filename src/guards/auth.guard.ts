import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { request } from 'http';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly useService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    // const request = context.switchToHttp().getRequest().headers;
     const request = context.switchToHttp().getRequest();
    //  console.log( request);
      // const { authorization } = request;
    const { authorization } = request.headers;
    try {
      const data = this.authService.checkToken(
        (authorization ?? '').split(' ')[1],
      );

      request.tokenPayload = data;
      request.user = await this.useService.show(data.id);

      return true;
    } catch (error) {
      return false;
    }

    //     console.log(autorization)
    //         this.authService.inInvalidToken((autorization ?? '').split(' ')[1])

    // return true;
  }
}

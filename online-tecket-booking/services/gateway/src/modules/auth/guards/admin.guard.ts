import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      return false;
    }

    return this.validateAdmin(token);
  }

  private async validateAdmin(auth: string): Promise<boolean> {
    try {
      const response = await this.authService.validateToken(auth);
      return response.user.role === 'admin';
    } catch {
      return false;
    }
  }
}

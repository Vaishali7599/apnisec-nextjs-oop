import type { NextRequest } from 'next/server';
import { AuthError } from '../core/errors';
import type { IAuthService } from './AuthService';

export interface IAuthGuard {
  requireUser(req: NextRequest): Promise<{ id: string; email: string; name: string | null }>;
  optionalUser(req: NextRequest): Promise<{ id: string; email: string; name: string | null } | null>;
}

export class AuthGuard implements IAuthGuard {
  constructor(private readonly auth: IAuthService) {}

  public async requireUser(req: NextRequest) {
    const user = await this.optionalUser(req);
    if (!user) throw new AuthError('Authentication required');
    return user;
  }

  public async optionalUser(req: NextRequest) {
    const token = req.cookies.get('access_token')?.value;
    if (!token) return null;
    return this.auth.getUserFromAccessToken(token);
  }
}

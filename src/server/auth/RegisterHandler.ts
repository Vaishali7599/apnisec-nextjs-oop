import type { NextRequest } from 'next/server';
import { BaseHandler } from '../core/BaseHandler';
import { Container } from '../core/Container';

export class RegisterHandler extends BaseHandler {
  private readonly c = Container.get();

  public async handle(req: NextRequest) {
    const rl = this.applyRateLimit(req, 'auth.register');
    try {
      const body = await req.json();
      const input = this.c.authValidator.validateRegister(body);
      const result = await this.c.authService.register(input);

      const res = this.response.ok({ user: result.user }, 201, rl);
      res.cookies.set('access_token', result.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 15 * 60
      });
      res.cookies.set('refresh_token', result.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60
      });
      return res;
    } catch (e) {
      return this.response.fail(e, rl);
    }
  }
}

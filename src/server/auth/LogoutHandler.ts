import type { NextRequest } from 'next/server';
import { BaseHandler } from '../core/BaseHandler';
import { Container } from '../core/Container';

export class LogoutHandler extends BaseHandler {
  private readonly c = Container.get();

  public async handle(req: NextRequest) {
    const rl = this.applyRateLimit(req, 'auth.logout');
    try {
      const user = await this.c.authGuard.optionalUser(req);
      await this.c.authService.logout(user?.id ?? null);
      const res = this.response.ok({ message: 'Logged out' }, 200, rl);
      res.cookies.set('access_token', '', { httpOnly: true, path: '/', maxAge: 0 });
      res.cookies.set('refresh_token', '', { httpOnly: true, path: '/', maxAge: 0 });
      return res;
    } catch (e) {
      return this.response.fail(e, rl);
    }
  }
}

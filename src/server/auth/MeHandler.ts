import type { NextRequest } from 'next/server';
import { BaseHandler } from '../core/BaseHandler';
import { Container } from '../core/Container';

export class MeHandler extends BaseHandler {
  private readonly c = Container.get();

  public async handle(req: NextRequest) {
    const rl = this.applyRateLimit(req, 'auth.me');
    try {
      const user = await this.c.authGuard.requireUser(req);
      return this.response.ok({ user }, 200, rl);
    } catch (e) {
      return this.response.fail(e, rl);
    }
  }
}

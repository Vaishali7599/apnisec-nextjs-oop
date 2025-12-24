import type { NextRequest } from 'next/server';
import { BaseHandler } from '../core/BaseHandler';
import { Container } from '../core/Container';

export class ProfileHandler extends BaseHandler {
  private readonly c = Container.get();

  public async get(req: NextRequest) {
    const rl = this.applyRateLimit(req, 'users.profile.get');
    try {
      const user = await this.c.authGuard.requireUser(req);
      const profile = await this.c.profileService.get(user.id);
      return this.response.ok({ profile }, 200, rl);
    } catch (e) {
      return this.response.fail(e, rl);
    }
  }

  public async put(req: NextRequest) {
    const rl = this.applyRateLimit(req, 'users.profile.put');
    try {
      const user = await this.c.authGuard.requireUser(req);
      const body = await req.json();
      const input = this.c.profileValidator.validateUpdate(body);
      const profile = await this.c.profileService.update(user.id, input);
      return this.response.ok({ profile }, 200, rl);
    } catch (e) {
      return this.response.fail(e, rl);
    }
  }
}

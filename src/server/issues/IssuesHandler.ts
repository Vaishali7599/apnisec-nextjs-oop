import type { NextRequest } from 'next/server';
import { BaseHandler } from '../core/BaseHandler';
import { Container } from '../core/Container';

export class IssuesHandler extends BaseHandler {
  private readonly c = Container.get();

  public async get(req: NextRequest) {
    const rl = this.applyRateLimit(req, 'issues.list');
    try {
      const user = await this.c.authGuard.requireUser(req);
      const type = this.c.issueValidator.validateTypeQuery(req.nextUrl.searchParams.get('type'));
      const items = await this.c.issueService.list(user.id, type);
      return this.response.ok({ items }, 200, rl);
    } catch (e) {
      return this.response.fail(e, rl);
    }
  }

  public async post(req: NextRequest) {
    const rl = this.applyRateLimit(req, 'issues.create');
    try {
      const user = await this.c.authGuard.requireUser(req);
      const body = await req.json();
      const input = this.c.issueValidator.validateCreate(body);
      const item = await this.c.issueService.create(user.id, input);
      return this.response.ok({ item }, 201, rl);
    } catch (e) {
      return this.response.fail(e, rl);
    }
  }
}

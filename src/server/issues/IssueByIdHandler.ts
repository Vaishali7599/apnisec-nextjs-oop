import type { NextRequest } from 'next/server';
import { BaseHandler } from '../core/BaseHandler';
import { Container } from '../core/Container';

export class IssueByIdHandler extends BaseHandler {
  private readonly c = Container.get();

  public async get(req: NextRequest, id: string) {
    const rl = this.applyRateLimit(req, 'issues.get');
    try {
      const user = await this.c.authGuard.requireUser(req);
      const item = await this.c.issueService.get(user.id, id);
      return this.response.ok({ item }, 200, rl);
    } catch (e) {
      return this.response.fail(e, rl);
    }
  }

  public async put(req: NextRequest, id: string) {
    const rl = this.applyRateLimit(req, 'issues.update');
    try {
      const user = await this.c.authGuard.requireUser(req);
      const body = await req.json();
      const input = this.c.issueValidator.validateUpdate(body);
      const item = await this.c.issueService.update(user.id, id, {
        ...input,
        priority: input.priority ?? null,
        status: input.status ?? null
      });
      return this.response.ok({ item }, 200, rl);
    } catch (e) {
      return this.response.fail(e, rl);
    }
  }

  public async delete(req: NextRequest, id: string) {
    const rl = this.applyRateLimit(req, 'issues.delete');
    try {
      const user = await this.c.authGuard.requireUser(req);
      await this.c.issueService.delete(user.id, id);
      return this.response.ok({ message: 'Deleted' }, 200, rl);
    } catch (e) {
      return this.response.fail(e, rl);
    }
  }
}

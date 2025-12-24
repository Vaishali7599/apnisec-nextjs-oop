import type { NextRequest } from 'next/server';
import { BaseHandler } from '../core/BaseHandler';
import { Container } from '../core/Container';

export class NotesHandler extends BaseHandler {
  private readonly c = Container.get();

  public async get(req: NextRequest) {
    const rl = this.applyRateLimit(req, 'notes.list');
    try {
      const user = await this.c.authGuard.requireUser(req);
      const items = await this.c.noteService.list(user.id);
      return this.response.ok({ items }, 200, rl);
    } catch (e) {
      return this.response.fail(e, rl);
    }
  }

  public async post(req: NextRequest) {
    const rl = this.applyRateLimit(req, 'notes.create');
    try {
      const user = await this.c.authGuard.requireUser(req);
      const body = await req.json();
      const input = this.c.noteValidator.validateCreate(body);
      const note = await this.c.noteService.create(user.id, input);
      return this.response.ok({ note }, 201, rl);
    } catch (e) {
      return this.response.fail(e, rl);
    }
  }
}

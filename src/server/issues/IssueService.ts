import { NotFoundError } from '../core/errors';
import type { IIssueRepository } from './IssueRepository';
import type { IEmailService } from '../email/EmailService';
import type { IUserRepository } from '../users/UserRepository';

export interface IIssueService {
  list(userId: string, type?: string | null): Promise<any[]>;
  get(userId: string, id: string): Promise<any>;
  create(userId: string, data: { type: string; title: string; description: string; priority?: string; status?: string }): Promise<any>;
  update(userId: string, id: string, data: any): Promise<any>;
  delete(userId: string, id: string): Promise<void>;
}

export class IssueService implements IIssueService {
  constructor(
    private readonly issues: IIssueRepository,
    private readonly users: IUserRepository,
    private readonly email: IEmailService
  ) {}

  public async list(userId: string, type?: string | null) {
    const items = await this.issues.listByUser(userId, type);
    return items.map((i) => ({ ...i, createdAt: i.createdAt.toISOString(), updatedAt: i.updatedAt.toISOString() }));
  }

  public async get(userId: string, id: string) {
    const issue = await this.issues.getByIdForUser(userId, id);
    if (!issue) throw new NotFoundError('Issue not found');
    return { ...issue, createdAt: issue.createdAt.toISOString(), updatedAt: issue.updatedAt.toISOString() };
  }

  public async create(
  userId: string,
  data: {
    type: string;
    title: string;
    description: string;
    priority?: string | null;
    status?: string | null;
  }
): Promise<any> {
    const issue = await this.issues.createForUser(userId, {
      type: data.type,
      title: data.title,
      description: data.description,
      priority: data.priority ?? null,
      status: data.status ?? null
    });

    const user = await this.users.findById(userId);
    if (user) {
      this.email
        .sendIssueCreated(user.email, { type: data.type, title: data.title, description: data.description })
        .catch(() => undefined);
    }

    return { ...issue, createdAt: issue.createdAt.toISOString(), updatedAt: issue.updatedAt.toISOString() };
  }

  public async update(userId: string, id: string, data: { type?: string; title?: string; description?: string; priority?: string | null; status?: string | null }) {
    const updated = await this.issues.updateForUser(userId, id, data);
    if (!updated) throw new NotFoundError('Issue not found');
    return { ...updated, createdAt: updated.createdAt.toISOString(), updatedAt: updated.updatedAt.toISOString() };
  }

  public async delete(userId: string, id: string) {
    const ok = await this.issues.deleteForUser(userId, id);
    if (!ok) throw new NotFoundError('Issue not found');
  }
}

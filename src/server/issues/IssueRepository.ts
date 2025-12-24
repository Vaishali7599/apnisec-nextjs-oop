import type { PrismaClient, Issue } from '@prisma/client';

export interface IIssueRepository {
  listByUser(userId: string, type?: string | null): Promise<Issue[]>;
  getByIdForUser(userId: string, id: string): Promise<Issue | null>;
  createForUser(userId: string, data: { type: string; title: string; description: string; priority?: string | null; status?: string | null }): Promise<Issue>;
  updateForUser(userId: string, id: string, data: { title?: string; description?: string; priority?: string | null; status?: string | null; type?: string }): Promise<Issue | null>;
  deleteForUser(userId: string, id: string): Promise<boolean>;
}

export class IssueRepository implements IIssueRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public listByUser(userId: string, type?: string | null) {
    return this.prisma.issue.findMany({
      where: { userId, ...(type ? { type } : {}) },
      orderBy: { createdAt: 'desc' }
    });
  }

  public getByIdForUser(userId: string, id: string) {
    return this.prisma.issue.findFirst({ where: { id, userId } });
  }

  public createForUser(userId: string, data: { type: string; title: string; description: string; priority?: string | null; status?: string | null }) {
    return this.prisma.issue.create({
      data: { userId, ...data }
    });
  }

  public async updateForUser(
    userId: string,
    id: string,
    data: { title?: string; description?: string; priority?: string | null; status?: string | null; type?: string }
  ) {
    const existing = await this.getByIdForUser(userId, id);
    if (!existing) return null;
    return this.prisma.issue.update({ where: { id }, data });
  }

  public async deleteForUser(userId: string, id: string) {
    const existing = await this.getByIdForUser(userId, id);
    if (!existing) return false;
    await this.prisma.issue.delete({ where: { id } });
    return true;
  }
}

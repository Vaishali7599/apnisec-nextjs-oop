import type { PrismaClient, Note } from '@prisma/client';

export interface INoteRepository {
  listByUser(userId: string): Promise<Note[]>;
  createForUser(userId: string, data: { title: string; content: string }): Promise<Note>;
}

export class NoteRepository implements INoteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public listByUser(userId: string) {
    return this.prisma.note.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  public createForUser(userId: string, data: { title: string; content: string }) {
    return this.prisma.note.create({ data: { userId, ...data } });
  }
}

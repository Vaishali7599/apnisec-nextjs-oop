import type { INoteRepository } from './NoteRepository';

export interface INoteService {
  list(userId: string): Promise<any[]>;
  create(userId: string, data: { title: string; content: string }): Promise<any>;
}

export class NoteService implements INoteService {
  constructor(private readonly notes: INoteRepository) {}

  public async list(userId: string) {
    const items = await this.notes.listByUser(userId);
    return items.map((n) => ({ ...n, createdAt: n.createdAt.toISOString(), updatedAt: n.updatedAt.toISOString() }));
  }

  public async create(userId: string, data: { title: string; content: string }) {
    const note = await this.notes.createForUser(userId, data);
    return { ...note, createdAt: note.createdAt.toISOString(), updatedAt: note.updatedAt.toISOString() };
  }
}

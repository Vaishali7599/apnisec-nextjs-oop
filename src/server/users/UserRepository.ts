import type { PrismaClient, User } from '@prisma/client';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: { email: string; name?: string | null; passwordHash: string }): Promise<User>;
  updateProfile(id: string, data: { name?: string | null; bio?: string | null }): Promise<User>;
}

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  public findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public create(data: { email: string; name?: string | null; passwordHash: string }) {
    return this.prisma.user.create({ data });
  }

  public updateProfile(id: string, data: { name?: string | null; bio?: string | null }) {
    return this.prisma.user.update({ where: { id }, data });
  }
}

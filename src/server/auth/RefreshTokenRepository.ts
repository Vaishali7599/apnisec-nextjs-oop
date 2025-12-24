import type { PrismaClient, RefreshToken } from '@prisma/client';

export interface IRefreshTokenRepository {
  create(data: { userId: string; tokenHash: string; expiresAt: Date }): Promise<RefreshToken>;
  findValid(userId: string, tokenHash: string): Promise<RefreshToken | null>;
  deleteById(id: string): Promise<void>;
  deleteAllForUser(userId: string): Promise<void>;
}

export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public create(data: { userId: string; tokenHash: string; expiresAt: Date }) {
    return this.prisma.refreshToken.create({ data });
  }

  public findValid(userId: string, tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: { userId, tokenHash, expiresAt: { gt: new Date() } }
    });
  }

  public async deleteById(id: string) {
    await this.prisma.refreshToken.delete({ where: { id } });
  }

  public async deleteAllForUser(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}

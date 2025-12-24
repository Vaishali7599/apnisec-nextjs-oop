import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export class PrismaFactory {
  public create(): PrismaClient {
    if (process.env.NODE_ENV === 'production') {
      return new PrismaClient();
    }
    if (!global.__prisma) {
      global.__prisma = new PrismaClient();
    }
    return global.__prisma;
  }
}

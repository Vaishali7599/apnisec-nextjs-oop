import type { IUserRepository } from './UserRepository';
import type { IEmailService } from '../email/EmailService';
import { NotFoundError } from '../core/errors';

export interface IProfileService {
  get(userId: string): Promise<{ id: string; email: string; name: string | null; bio: string | null }>;
  update(userId: string, data: { name?: string; bio?: string }): Promise<{ id: string; email: string; name: string | null; bio: string | null }>;
}

export class ProfileService implements IProfileService {
  constructor(private readonly users: IUserRepository, private readonly email: IEmailService) {}

  public async get(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return { id: user.id, email: user.email, name: user.name, bio: user.bio };
  }

  public async update(userId: string, data: { name?: string; bio?: string }) {
    const user = await this.users.updateProfile(userId, { name: data.name ?? undefined, bio: data.bio ?? undefined });
    this.email.sendProfileUpdated(user.email, user.name).catch(() => undefined);
    return { id: user.id, email: user.email, name: user.name, bio: user.bio };
  }
}

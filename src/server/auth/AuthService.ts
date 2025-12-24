import { AuthError, ValidationError } from '../core/errors';
import type { IUserRepository } from '../users/UserRepository';
import type { IPasswordService } from './PasswordService';
import type { IJwtService } from './JwtService';
import type { IRefreshTokenRepository } from './RefreshTokenRepository';
import type { ICryptoUtil } from '../utils/CryptoUtil';
import type { IEmailService } from '../email/EmailService';

export interface IAuthService {
  register(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<{
    user: { id: string; email: string; name: string | null };
    accessToken: string;
    refreshToken: string;
  }>;

  login(input: {
    email: string;
    password: string;
  }): Promise<{
    user: { id: string; email: string; name: string | null };
    accessToken: string;
    refreshToken: string;
  }>;

  getUserFromAccessToken(token: string): Promise<{
    id: string;
    email: string;
    name: string | null;
  }>;

  logout(userId: string | null): Promise<void>;
}

export class AuthService implements IAuthService {
  constructor(
    private readonly users: IUserRepository,
    private readonly passwords: IPasswordService,
    private readonly jwt: IJwtService,
    private readonly refreshTokens: IRefreshTokenRepository,
    private readonly crypto: ICryptoUtil,
    private readonly email: IEmailService
  ) {}

  public async register(input: { name: string; email: string; password: string }) {
    try {
      const email = input.email.trim().toLowerCase();
      const name = input.name?.trim() || null;

      console.log('[AuthService.register] start', { email });

      const existing = await this.users.findByEmail(email);
      console.log('[AuthService.register] existing checked', { exists: !!existing });
      if (existing) throw new ValidationError('Email already registered');

      const passwordHash = await this.passwords.hash(input.password);
      console.log('[AuthService.register] password hashed');

      const user = await this.users.create({
        email,
        name,
        passwordHash
      });
      console.log('[AuthService.register] user created', { id: user.id });

      // Tokens (if env missing, this will throw; logs will tell you where)
      const accessToken = this.jwt.signAccess({ sub: user.id, email: user.email });
      console.log('[AuthService.register] access token signed');

      const refreshToken = this.jwt.signRefresh({ sub: user.id, email: user.email });
      console.log('[AuthService.register] refresh token signed');

      await this.refreshTokens.create({
        userId: user.id,
        tokenHash: this.crypto.sha256(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
      console.log('[AuthService.register] refresh token saved');

      // fire-and-forget email; do not block signup on email issues
      this.email
        .sendWelcome(user.email, user.name ?? '')
        .catch((e) => console.error('[AuthService.register] welcome email failed', e));

      return {
        user: { id: user.id, email: user.email, name: user.name },
        accessToken,
        refreshToken
      };
    } catch (err: any) {
      console.error('[AuthService.register] FAILED', err);

      // Preserve known errors
      if (err instanceof ValidationError) throw err;
      if (err instanceof AuthError) throw err;

      // Convert unknown errors to a consistent auth error
      throw new AuthError('Registration failed');
    }
  }

  public async login(input: { email: string; password: string }) {
    try {
      const email = input.email.trim().toLowerCase();

      console.log('[AuthService.login] start', { email });

      const user = await this.users.findByEmail(email);
      console.log('[AuthService.login] user found', { found: !!user });
      if (!user) throw new AuthError('Invalid credentials');

      const ok = await this.passwords.verify(input.password, user.passwordHash);
      console.log('[AuthService.login] password verify', { ok });
      if (!ok) throw new AuthError('Invalid credentials');

      const accessToken = this.jwt.signAccess({ sub: user.id, email: user.email });
      console.log('[AuthService.login] access token signed');

      const refreshToken = this.jwt.signRefresh({ sub: user.id, email: user.email });
      console.log('[AuthService.login] refresh token signed');

      await this.refreshTokens.create({
        userId: user.id,
        tokenHash: this.crypto.sha256(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
      console.log('[AuthService.login] refresh token saved');

      return {
        user: { id: user.id, email: user.email, name: user.name },
        accessToken,
        refreshToken
      };
    } catch (err: any) {
      console.error('[AuthService.login] FAILED', err);

      if (err instanceof ValidationError) throw err;
      if (err instanceof AuthError) throw err;

      throw new AuthError('Login failed');
    }
  }

  public async getUserFromAccessToken(token: string) {
    try {
      const payload = this.jwt.verifyAccess(token);
      const user = await this.users.findById(payload.sub);
      if (!user) throw new AuthError('User not found');
      return { id: user.id, email: user.email, name: user.name };
    } catch (err: any) {
      console.error('[AuthService.getUserFromAccessToken] FAILED', err);
      if (err instanceof AuthError) throw err;
      throw new AuthError('Invalid session');
    }
  }

  public async logout(userId: string | null): Promise<void> {
    try {
      if (userId) {
        await this.refreshTokens.deleteAllForUser(userId);
      }
    } catch (err: any) {
      console.error('[AuthService.logout] FAILED', err);
      // logout should not blow up the app; swallow or throw based on your preference
    }
  }
}

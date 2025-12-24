import jwt from 'jsonwebtoken';
import { AuthError } from '../core/errors';

export type JwtPayload = {
  sub: string;
  email: string;
};

export interface IJwtService {
  signAccess(payload: JwtPayload): string;
  signRefresh(payload: JwtPayload): string;
  verifyAccess(token: string): JwtPayload;
  verifyRefresh(token: string): JwtPayload;
}

export class JwtService implements IJwtService {
  private readonly secret: string;

  constructor() {
    const s = process.env.JWT_SECRET;
    if (!s) throw new Error('JWT_SECRET is required');
    this.secret = s;
  }

  public signAccess(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: '15m' });
  }

  public signRefresh(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' });
  }

  public verifyAccess(token: string): JwtPayload {
    return this.verify(token);
  }

  public verifyRefresh(token: string): JwtPayload {
    return this.verify(token);
  }

  private verify(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch {
      throw new AuthError('Invalid or expired token');
    }
  }
}

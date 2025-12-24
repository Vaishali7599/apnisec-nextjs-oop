import { z } from 'zod';
import { ValidationError } from '../core/errors';

export type RegisterInput = { name: string; email: string; password: string };
export type LoginInput = { email: string; password: string };

export interface IAuthValidator {
  validateRegister(input: unknown): RegisterInput;
  validateLogin(input: unknown): LoginInput;
}

export class AuthValidator implements IAuthValidator {
  private registerSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email().max(255),
    password: z.string().min(8).max(100)
  });

  private loginSchema = z.object({
    email: z.string().email().max(255),
    password: z.string().min(1).max(100)
  });

  public validateRegister(input: unknown): RegisterInput {
    const parsed = this.registerSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError('Invalid registration data', parsed.error.flatten());
    return parsed.data;
  }

  public validateLogin(input: unknown): LoginInput {
    const parsed = this.loginSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError('Invalid login data', parsed.error.flatten());
    return parsed.data;
  }
}

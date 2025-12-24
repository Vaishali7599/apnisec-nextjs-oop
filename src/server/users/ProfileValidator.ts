import { z } from 'zod';
import { ValidationError } from '../core/errors';

export type UpdateProfileInput = { name?: string; bio?: string };

export interface IProfileValidator {
  validateUpdate(input: unknown): UpdateProfileInput;
}

export class ProfileValidator implements IProfileValidator {
  private schema = z.object({
    name: z.string().max(100).optional(),
    bio: z.string().max(500).optional()
  });

  public validateUpdate(input: unknown): UpdateProfileInput {
    const parsed = this.schema.safeParse(input);
    if (!parsed.success) throw new ValidationError('Invalid profile data', parsed.error.flatten());
    return parsed.data;
  }
}

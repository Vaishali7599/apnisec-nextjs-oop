import { z } from 'zod';
import { ValidationError } from '../core/errors';

export type CreateNoteInput = { title: string; content: string };

export interface INoteValidator {
  validateCreate(input: unknown): CreateNoteInput;
}

export class NoteValidator implements INoteValidator {
  private schema = z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1).max(5000)
  });

  public validateCreate(input: unknown): CreateNoteInput {
    const parsed = this.schema.safeParse(input);
    if (!parsed.success) throw new ValidationError('Invalid note data', parsed.error.flatten());
    return parsed.data;
  }
}

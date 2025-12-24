import { z } from 'zod';
import { ValidationError } from '../core/errors';

const IssueTypes = ['cloud-security', 'redteam-assessment', 'vapt'] as const;

export type CreateIssueInput = {
  type: (typeof IssueTypes)[number];
  title: string;
  description: string;
  priority?: string;
  status?: string;
};

export type UpdateIssueInput = Partial<CreateIssueInput>;

export interface IIssueValidator {
  validateCreate(input: unknown): CreateIssueInput;
  validateUpdate(input: unknown): UpdateIssueInput;
  validateTypeQuery(type: unknown): string | null;
}

export class IssueValidator implements IIssueValidator {
  private createSchema = z.object({
    type: z.enum(IssueTypes),
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(5000),
    priority: z.string().max(50).optional(),
    status: z.string().max(50).optional()
  });

  private updateSchema = this.createSchema.partial();

  public validateCreate(input: unknown): CreateIssueInput {
    const parsed = this.createSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError('Invalid issue data', parsed.error.flatten());
    return parsed.data;
  }

  public validateUpdate(input: unknown): UpdateIssueInput {
    const parsed = this.updateSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError('Invalid issue update', parsed.error.flatten());
    return parsed.data;
  }

  public validateTypeQuery(type: unknown): string | null {
    if (!type) return null;
    const parsed = z.enum(IssueTypes).safeParse(type);
    if (!parsed.success) throw new ValidationError('Invalid issue type filter');
    return parsed.data;
  }
}

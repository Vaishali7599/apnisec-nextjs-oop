import type { NextRequest } from 'next/server';
import { ResponseBuilder } from './response';
import { MemoryRateLimiter, type IRateLimiter } from '../rateLimit/RateLimiter';
import { RequestContext } from './request';

export interface HandlerDeps {
  rateLimiter: IRateLimiter;
  response: ResponseBuilder;
}

export abstract class BaseHandler {
  protected readonly response: ResponseBuilder;
  protected readonly rateLimiter: IRateLimiter;

  constructor(deps?: Partial<HandlerDeps>) {
    this.response = deps?.response ?? new ResponseBuilder();
    this.rateLimiter = deps?.rateLimiter ?? new MemoryRateLimiter();
  }

  protected applyRateLimit(req: NextRequest, keySuffix: string, limit = 100, windowMs = 15 * 60 * 1000) {
    const ctx = new RequestContext(req);
    const key = `${ctx.ip()}:${keySuffix}`;
    return this.rateLimiter.check(key, limit, windowMs).headers;
  }

  protected mergeHeaders(...headers: Array<Record<string, string> | undefined>) {
    return Object.assign({}, ...headers.filter(Boolean));
  }
}

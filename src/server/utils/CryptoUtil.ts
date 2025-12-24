import crypto from 'crypto';

export interface ICryptoUtil {
  sha256(input: string): string;
}

export class CryptoUtil implements ICryptoUtil {
  public sha256(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }
}

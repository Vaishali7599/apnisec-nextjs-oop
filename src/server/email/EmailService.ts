import { Resend } from 'resend';

export interface IEmailService {
  sendWelcome(to: string, name: string): Promise<void>;
  sendIssueCreated(to: string, payload: { type: string; title: string; description: string }): Promise<void>;
  sendProfileUpdated(to: string, name: string | null): Promise<void>;
}

export class ResendEmailService implements IEmailService {
  private readonly client: Resend;
  private readonly from: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey) throw new Error('RESEND_API_KEY is required');
    if (!from) throw new Error('EMAIL_FROM is required');
    this.client = new Resend(apiKey);
    this.from = from;
  }

  public async sendWelcome(to: string, name: string) {
    await this.client.emails.send({
      from: this.from,
      to,
      subject: 'Welcome to ApniSec',
      html: this.wrapHtml(`
        <h1 style="margin:0">Welcome${name ? `, ${this.escape(name)}` : ''}!</h1>
        <p>Thanks for signing up. Your ApniSec portal is ready — you can now create and track security issues.</p>
        <p><strong>Next step:</strong> log in and open your first issue (Cloud Security / Red Team / VAPT).</p>
      `)
    });
  }

  public async sendIssueCreated(to: string, payload: { type: string; title: string; description: string }) {
    await this.client.emails.send({
      from: this.from,
      to,
      subject: `ApniSec Issue Created: ${payload.title}`,
      html: this.wrapHtml(`
        <h2 style="margin:0">Issue created</h2>
        <p><strong>Type:</strong> ${this.escape(payload.type)}</p>
        <p><strong>Title:</strong> ${this.escape(payload.title)}</p>
        <p><strong>Description:</strong></p>
        <pre style="white-space:pre-wrap;background:#0b1220;border:1px solid #1f2a44;padding:12px;border-radius:8px;color:#e6edf3">${this.escape(payload.description)}</pre>
      `)
    });
  }

  public async sendProfileUpdated(to: string, name: string | null) {
    await this.client.emails.send({
      from: this.from,
      to,
      subject: 'ApniSec Profile Updated',
      html: this.wrapHtml(`
        <h2 style="margin:0">Profile updated</h2>
        <p>Your profile has been updated${name ? ` to <strong>${this.escape(name)}</strong>` : ''}.</p>
        <p>If you did not perform this action, please reset your password and contact support.</p>
      `)
    });
  }

  private wrapHtml(content: string) {
    return `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto;line-height:1.6;background:#0a0f1c;color:#e6edf3;padding:24px">
        <div style="max-width:640px;margin:0 auto;border:1px solid #1f2a44;border-radius:12px;padding:20px;background:#0b1220">
          ${content}
          <hr style="border:none;border-top:1px solid #1f2a44;margin:20px 0"/>
          <p style="margin:0;font-size:12px;color:#94a3b8">ApniSec — secure shipping made practical.</p>
        </div>
      </div>
    `;
  }

  private escape(s: string) {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
  }
}

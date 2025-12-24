import './styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'ApniSec | Security Issues Portal',
    template: '%s | ApniSec'
  },
  description:
    'ApniSec helps teams ship securely with cloud security, red team assessments, and VAPT services. Log in to manage security issues and requests.',
  applicationName: 'ApniSec Issues Portal',
  keywords: [
    'cybersecurity',
    'cloud security',
    'VAPT',
    'penetration testing',
    'red team assessment',
    'security issues portal'
  ],
  openGraph: {
    title: 'ApniSec | Security Issues Portal',
    description:
      'Cybersecurity services and an issues portal for Cloud Security, Red Team Assessments, and VAPT.',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

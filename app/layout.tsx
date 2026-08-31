import type { Metadata } from 'next';
import { Orbitron, Inter } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Abhimanyu Kumar | Cybersecurity Engineer | SOC & DevSecOps',
  description:
    'Abhimanyu Kumar — Cybersecurity Engineer, SOC Analyst, DevSecOps. Building secure infrastructure, CI/CD security pipelines, and security monitoring systems. Creator of SecureFlow, SentryVault, and Red Flag Detector. Based in Pune, India.',
  keywords: [
    'Cybersecurity Engineer', 'SOC Analyst', 'DevSecOps Engineer', 'Abhimanyu Kumar',
    'Wazuh SIEM', 'Suricata', 'Jenkins CI/CD', 'Gitleaks', 'Semgrep', 'Trivy', 'OWASP ZAP',
    'Network Security', 'Security Automation', 'Linux Hardening',
    'Pune', 'India', 'Cybersecurity Portfolio',
  ],
  openGraph: {
    title: 'Abhimanyu Kumar | Cybersecurity Engineer',
    description: 'SOC Analyst · DevSecOps Engineer · Security Automation. SecureFlow | SentryVault | Red Flag Detector.',
    url: 'https://abhimanyu-kumar.vercel.app',
    siteName: 'Abhimanyu Kumar',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abhimanyu Kumar | Cybersecurity Engineer | SOC & DevSecOps',
    description: 'Building secure infrastructure and DevSecOps pipelines. SOC Analyst, Security Automation, 4 featured security projects.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Abhimanyu Kumar',
            jobTitle: 'SOC Analyst | DevSecOps Engineer | Cybersecurity Analyst',
            email: 'abhimanyu9272@gmail.com',
            url: 'https://abhimanyu-kumar.vercel.app',
            sameAs: [
              'https://linkedin.com/in/abhimanyu-sec',
              'https://github.com/abhienix',
            ],
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Pune',
              addressRegion: 'Maharashtra',
              addressCountry: 'India',
            },
          }),
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4">
        <section className="grid gap-10 py-16 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Ship fast. Stay secure.
            </h1>
            <p className="mt-4 text-base text-slate-300 md:text-lg">
              ApniSec helps teams harden their infrastructure and applications through Cloud Security reviews, Red Team Assessments, and VAPT.
              Use the Security Portal to open issues, track progress, and collaborate with our experts.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-md bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-400"
              >
                Get started
              </Link>
              <Link
                href="/#services"
                className="rounded-md border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-900"
              >
                Explore services
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-slate-400">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <div className="text-slate-200">100+</div>
                <div>Assessments delivered</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <div className="text-slate-200">24h</div>
                <div>First response SLA</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <div className="text-slate-200">SOC</div>
                <div>Actionable reporting</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 p-6 shadow-lg">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Live Risk Radar</div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">Demo</span>
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-300">Cloud Misconfiguration</span>
                  <span className="rounded-md bg-amber-400/20 px-2 py-1 text-xs text-amber-200">Medium</span>
                </li>
                <li className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-300">Exposed Secrets</span>
                  <span className="rounded-md bg-rose-400/20 px-2 py-1 text-xs text-rose-200">High</span>
                </li>
                <li className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-300">Weak MFA Policy</span>
                  <span className="rounded-md bg-sky-400/20 px-2 py-1 text-xs text-sky-200">Low</span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-slate-400">
                Track findings end-to-end in the Portal: triage, remediation, and verification.
              </p>
            </div>
          </div>
        </section>

        <section id="services" className="py-14">
          <h2 className="text-2xl font-semibold">Services</h2>
          <p className="mt-2 text-slate-300">
            Choose a security engagement — or open an issue anytime for ongoing support.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Cloud Security',
                desc: 'Threat modeling, IAM hardening, configuration reviews, and continuous control validation.'
              },
              {
                title: 'Red Team Assessment',
                desc: 'Adversary emulation with real-world tactics, including phishing and privilege escalation drills.'
              },
              {
                title: 'VAPT',
                desc: 'Full-stack vulnerability assessment and penetration testing with exploit proof-of-concepts.'
              }
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow"
              >
                <div className="text-lg font-semibold">{card.title}</div>
                <p className="mt-2 text-sm text-slate-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="approach" className="py-14">
          <h2 className="text-2xl font-semibold">How we work</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ['Discover', 'Understand assets, architecture, and your threat landscape.'],
              ['Assess', 'Run security tests aligned to OWASP, NIST, and cloud benchmarks.'],
              ['Fix', 'Prioritize remediation with practical playbooks and engineering support.'],
              ['Verify', 'Retest, document closure, and harden controls for the next release.']
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <div className="text-sm font-semibold">{title}</div>
                <p className="mt-2 text-sm text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-14">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 md:flex md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Ready to open your first issue?</h3>
              <p className="mt-2 text-sm text-slate-400">
                Create an account in seconds. You’ll get a welcome email and can start tracking security requests immediately.
              </p>
            </div>
            <div className="mt-6 flex gap-3 md:mt-0">
              <Link
                href="/register"
                className="rounded-md bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-400"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-900"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

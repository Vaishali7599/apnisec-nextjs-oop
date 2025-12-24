export default function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="text-lg font-semibold">ApniSec</div>
          <p className="mt-2 text-sm text-slate-400">
            Cybersecurity services for modern teams — Cloud Security, Red Team Assessments, and VAPT.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-200">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>Services</li>
            <li>Approach</li>
            <li>Security Portal</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-200">Contact</div>
          <p className="mt-3 text-sm text-slate-400">
            Email: hello@apnisec.com
            <br />
            Response time: within 24 hours
          </p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-6">
        <div className="mx-auto max-w-6xl px-4 text-xs text-slate-500">
          © {new Date().getFullYear()} ApniSec. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useEffect, useState } from 'react';

export default function ProfileClient() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ name: string; bio: string }>(
    { name: '', bio: '' }
  );
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch('/api/users/profile', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Failed to load');
      setEmail(data.profile.email);
      setForm({ name: data.profile.name ?? '', bio: data.profile.bio ?? '' });
    } catch (e: any) {
      setErr(e.message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Failed to save');
      setMsg('Profile updated.');
      await load();
    } catch (e: any) {
      setErr(e.message ?? 'Failed to save');
    }
  };

  if (loading) return <div className="text-slate-300">Loading profile…</div>;

  return (
    <div className="max-w-xl rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-2 text-sm text-slate-400">Manage your profile details.</p>

      <div className="mt-6 text-sm text-slate-300">
        <div className="text-xs text-slate-500">Email</div>
        <div className="mt-1">{email}</div>
      </div>

      {msg ? (
        <div className="mt-5 rounded-md border border-emerald-800 bg-emerald-950/30 p-3 text-sm text-emerald-200">
          {msg}
        </div>
      ) : null}
      {err ? (
        <div className="mt-5 rounded-md border border-rose-800 bg-rose-950/40 p-3 text-sm text-rose-200">
          {err}
        </div>
      ) : null}

      <form onSubmit={save} className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-slate-300">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />
        </div>
        <button className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">
          Save changes
        </button>
      </form>
    </div>
  );
}

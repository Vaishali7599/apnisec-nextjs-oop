'use client';

import { useEffect, useMemo, useState } from 'react';

type IssueType = 'cloud-security' | 'redteam-assessment' | 'vapt';

type Issue = {
  id: string;
  type: IssueType;
  title: string;
  description: string;
  priority: string | null;
  status: string | null;
  createdAt: string;
};

export default function DashboardClient() {
  const [user, setUser] = useState<{ id: string; name: string | null; email: string } | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<IssueType | 'all'>('all');
  const [q, setQ] = useState('');
  const [form, setForm] = useState({
    type: 'cloud-security' as IssueType,
    title: '',
    description: '',
    priority: '',
    status: ''
  });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
      const meData = await meRes.json();
      if (!meRes.ok) throw new Error(meData?.message ?? 'Failed to load user');
      setUser(meData.user);

      const url = new URL('/api/issues', window.location.origin);
      if (filter !== 'all') url.searchParams.set('type', filter);
      const issuesRes = await fetch(url.toString(), { cache: 'no-store' });
      const issuesData = await issuesRes.json();
      if (!issuesRes.ok) throw new Error(issuesData?.message ?? 'Failed to load issues');
      setIssues(issuesData.items);
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return issues;
    return issues.filter((i) =>
      [i.title, i.description, i.type, i.priority ?? '', i.status ?? ''].some((s) =>
        s.toLowerCase().includes(needle)
      )
    );
  }, [issues, q]);

  const createIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          title: form.title,
          description: form.description,
          priority: form.priority || undefined,
          status: form.status || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Failed to create');
      setForm((f) => ({ ...f, title: '', description: '' }));
      await load();
    } catch (e: any) {
      setError(e.message ?? 'Failed to create');
    }
  };

  const updateIssue = async (id: string, patch: Partial<Issue>) => {
    setError(null);
    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Failed to update');
      await load();
    } catch (e: any) {
      setError(e.message ?? 'Failed to update');
    }
  };

  const deleteIssue = async (id: string) => {
    if (!confirm('Delete this issue?')) return;
    setError(null);
    try {
      const res = await fetch(`/api/issues/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Failed to delete');
      await load();
    } catch (e: any) {
      setError(e.message ?? 'Failed to delete');
    }
  };

  if (loading) {
    return <div className="text-slate-300">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div className="text-sm text-slate-400">Welcome</div>
        <h1 className="mt-1 text-2xl font-semibold">
          {user?.name ? `Hi, ${user.name}` : 'Hi there'}
        </h1>
        <p className="mt-2 text-sm text-slate-300">You are signed in as {user?.email}.</p>
      </section>

      {error ? (
        <div className="rounded-md border border-rose-800 bg-rose-950/40 p-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <h2 className="text-lg font-semibold">Create Issue</h2>
          <p className="mt-1 text-sm text-slate-400">
            Open a security request for Cloud Security, Red Team, or VAPT.
          </p>
          <form onSubmit={createIssue} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-slate-300">Issue type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as IssueType }))}
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
              >
                <option value="cloud-security">Cloud Security</option>
                <option value="redteam-assessment">Reteam Assessment</option>
                <option value="vapt">VAPT</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                rows={4}
                className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-slate-300">Priority (optional)</label>
                <input
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                  placeholder="Low / Medium / High"
                  className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Status (optional)</label>
                <input
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  placeholder="Open / In Progress / Closed"
                  className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
              </div>
            </div>
            <button className="w-full rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">
              Create issue
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Issues</h2>
              <p className="mt-1 text-sm text-slate-400">Manage your created issues.</p>
            </div>
            <button
              onClick={load}
              className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-100 hover:bg-slate-900"
            >
              Refresh
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
            >
              <option value="all">All types</option>
              <option value="cloud-security">Cloud Security</option>
              <option value="redteam-assessment">Reteam Assessment</option>
              <option value="vapt">VAPT</option>
            </select>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="flex-1 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />
          </div>

          <div className="mt-6 space-y-4">
            {filtered.length === 0 ? (
              <div className="text-sm text-slate-400">No issues yet.</div>
            ) : (
              filtered.map((issue) => (
                <div key={issue.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-500">{issue.type}</div>
                      <div className="text-base font-semibold">{issue.title}</div>
                      <p className="mt-2 text-sm text-slate-400 whitespace-pre-wrap">{issue.description}</p>
                    </div>
                    <button
                      onClick={() => deleteIssue(issue.id)}
                      className="rounded-md border border-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-900"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-slate-500">Status</label>
                      <input
                        defaultValue={issue.status ?? ''}
                        onBlur={(e) => updateIssue(issue.id, { status: e.target.value || null } as any)}
                        placeholder="Open / In Progress / Closed"
                        className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Priority</label>
                      <input
                        defaultValue={issue.priority ?? ''}
                        onBlur={(e) => updateIssue(issue.id, { priority: e.target.value || null } as any)}
                        placeholder="Low / Medium / High"
                        className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    Created: {new Date(issue.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

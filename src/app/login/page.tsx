import Navbar from '../components/Navbar';
import LoginForm from './ui/LoginForm';

export const metadata = { title: 'Login' };

export default function LoginPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-8">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="mt-2 text-sm text-slate-400">Access your security portal dashboard.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}

import Navbar from '../components/Navbar';
import RegisterForm from './ui/RegisterForm';

export const metadata = { title: 'Register' };

export default function RegisterPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-8">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-slate-400">Start tracking security issues and requests.</p>
          <div className="mt-6">
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  );
}

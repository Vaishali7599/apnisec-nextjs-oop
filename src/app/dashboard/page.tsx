import Navbar from '../components/Navbar';
import DashboardClient from './ui/DashboardClient';

export const metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <DashboardClient />
      </main>
    </div>
  );
}

import Navbar from '../components/Navbar';
import ProfileClient from './ui/ProfileClient';

export const metadata = { title: 'Profile' };

export default function ProfilePage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <ProfileClient />
      </main>
    </div>
  );
}

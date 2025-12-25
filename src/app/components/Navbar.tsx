// 'use client';

// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [me, setMe] = useState<{ email: string; name: string | null } | null>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//        const res = await fetch("/api/auth/me", { credentials: "include" });
//        if (res.status === 401){ return; // just not logged in
//        const data = await res.json();
//       } else {
//           setMe(null);
//         }
//       } catch {
//         setMe(null);
//       }
//     })();
//   }, [pathname]);

//   const logout = async () => {
//     await fetch('/api/auth/logout', { method: 'POST' });
//     router.push('/');
//     router.refresh();
//   };

//   const navLink = (href: string, label: string) => {
//     const active = pathname === href;
//     return (
//       <Link
//         className={`rounded-md px-3 py-2 text-sm ${active ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-900'}`}
//         href={href}
//       >
//         {label}
//       </Link>
//     );
//   };

//   return (
//     <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
//       <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
//         <Link href="/" className="flex items-center gap-2">
//           <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600" />
//           <div>
//             <div className="text-base font-semibold leading-none">ApniSec</div>
//             <div className="text-xs text-slate-400">Security Operations</div>
//           </div>
//         </Link>

//         <nav className="hidden items-center gap-2 md:flex">
//           {navLink('/#services', 'Services')}
//           {navLink('/#approach', 'Approach')}
//           {navLink('/#contact', 'Contact')}
//           {me ? (
//             <>
//               {navLink('/dashboard', 'Dashboard')}
//               {navLink('/profile', 'Profile')}
//               <button
//                 onClick={logout}
//                 className="rounded-md bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link
//               href="/login"
//               className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400"
//             >
//               Login
//             </Link>
//           )}
//         </nav>

//         <div className="md:hidden">
//           <Link
//             href={me ? '/dashboard' : '/login'}
//             className="rounded-md bg-slate-800 px-3 py-2 text-sm text-white"
//           >
//             {me ? 'Dashboard' : 'Login'}
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }


'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ComponentProps } from 'react';

type LinkHref = ComponentProps<typeof Link>['href'];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<{ email: string; name: string | null } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', {
            credentials: "include",

         });

        if (res.status === 401) {
          setMe(null);
          return;
        }

        if (!res.ok) {
          setMe(null);
          return;
        }

        const data = await res.json();
        setMe(data);
      } catch {
        setMe(null);
      }
    })();
  }, [pathname]);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/');
    router.refresh();
  };

  const navLink = (href: LinkHref, label: string) => {
    // pathname won't match hash links, so this stays false for /#sections (that's fine)
    const active = typeof href === 'string' ? pathname === href : false;

    return (
      <Link
        className={`rounded-md px-3 py-2 text-sm ${
          active ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-900'
        }`}
        href={href}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600" />
          <div>
            <div className="text-base font-semibold leading-none">ApniSec</div>
            <div className="text-xs text-slate-400">Security Operations</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {/* Better than "/#services" for typed routes: use UrlObject with hash */}
          {navLink({ pathname: '/', hash: 'services' }, 'Services')}
          {navLink({ pathname: '/', hash: 'approach' }, 'Approach')}
          {navLink({ pathname: '/', hash: 'contact' }, 'Contact')}

          {me ? (
            <>
              {navLink('/dashboard', 'Dashboard')}
              {navLink('/profile', 'Profile')}
              <button
                onClick={logout}
                className="rounded-md bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400"
            >
              Login
            </Link>
          )}
        </nav>

        <div className="md:hidden">
          <Link
            href={me ? '/dashboard' : '/login'}
            className="rounded-md bg-slate-800 px-3 py-2 text-sm text-white"
          >
            {me ? 'Dashboard' : 'Login'}
          </Link>
        </div>
      </div>
    </header>
  );
}

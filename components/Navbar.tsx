// 'use client';

// import Link from 'next/link';
// import { useRouter, usePathname } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { LogOut, FileText, LayoutDashboard, Plus, User } from 'lucide-react';

// export default function Navbar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchUser();
//   }, [pathname]);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/auth/me');
//       if (response.status === 401) {
//         setUser(null);
//         return;
//       }
//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.user ?? null);
//       }
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await fetch('/api/auth/logout', { method: 'POST' });
//       toast.success('Logged out');
//       setUser(null);
//       router.push('/');
//       router.refresh();
//     } catch {
//       toast.error('Logout failed');
//     }
//   };

//   const navLinkClass = (path: string) => {
//     const isActive = pathname === path;
//     return `flex items-center gap-8 px-4 py-4 rounded-lg font-semibold transition-all whitespace-nowrap ${
//       isActive
//         ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl'
//         : 'text-text-primary hover:bg-bg-secondary'
//     }`;
//   };

//   return (
//     <nav className="sticky top-0 z-50 glass overflow-x-auto ">
//       <div className="container px-4">
//         <div className="flex items-center justify-between h-5 gap-2 "> 
//           {/* Logo  */}
//           <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-8 group pr-4 no-underline">
//             <div
//               className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-start justify-start shadow-lg group-hover:scale-110 transition-transform">
//               <FileText className="text-white" size={20} />
//             </div>
//             <div className="leading-none">
//               <div className="text-8xl font-black text-gradient ">MyWeekly</div>
//             </div>
//           </Link>

         

//           {/* right area */}
//           <div className="flex items-center gap-6 justify-end flex-nowrap px-4"> 
//             {!loading && user ? (
//               <>
//                 <div className="flex items-center gap-4 px-3 py-2 bg-bg-secondary rounded-lg">
//                   <User size={20} className="text-primary" />
//                   <span className="text-lg font-semibold text-text-primary truncate max-w-[160px]">{user.name}</span>
//                 </div>

//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center gap-6 text-secondery  px-8 py-10 rounded-xl font-semibold transition">
//                   <LogOut size={22} />
//                   <span className="hidden lg:inline">Logout</span>
//                 </button>
//               </>
//             ) : (
//               !loading && (
//                 <>
//                   <Link 
//                     href="/login" 
//                     className="btn btn-secondary w-full px-4 py-2 rounded-xl font-semibold " 
//                   >
//                     Sign In
//                   </Link>

//                   <Link href="/register" className="btn btn-primary  ">
//                     Sign Up 
//                   </Link>
//                 </>
//               )
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
// 'use client';

// import Link from 'next/link';
// import { useRouter, usePathname } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { LogOut, FileText, LayoutDashboard, Plus, User, Menu, X } from 'lucide-react';

// export default function Navbar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     fetchUser();
//   }, [pathname]);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/auth/me');
//       if (response.status === 401) {
//         setUser(null);
//         return;
//       }
//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.user ?? null);
//       }
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await fetch('/api/auth/logout', { method: 'POST' });
//       toast.success('Logged out');
//       setUser(null);
//       router.push('/');
//       router.refresh();
//     } catch {
//       toast.error('Logout failed');
//     }
//   };

//   const navLinkClass = (path: string) => {
//     const isActive = pathname === path;
//     return `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
//       isActive
//         ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
//         : 'text-text-primary hover:bg-bg-secondary'
//     }`;
//   };

//   return (
//     <nav className="glass border-b border-border-color sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
          
//           {/* Logo */}
//           <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 no-underline">
//             <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
//               <FileText className="text-white" size={18} />
//             </div>
//             <span className="text-2xl font-black text-gradient">MyWeekly</span>
//           </Link>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center gap-4">
//             {!loading && user && (
//               <>
//                 <Link href="/dashboard" className={navLinkClass('/dashboard')}>
//                   <LayoutDashboard size={18} />
//                   Dashboard
//                 </Link>

//                 <Link href="/reports" className={navLinkClass('/reports')}>
//                   <FileText size={18} />
//                   Reports
//                 </Link>

//                 <Link href="/reports/create" className="btn btn-primary flex items-center gap-2">
//                   <Plus size={18} />
//                   New Report
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Right Section */}
//           <div className="hidden md:flex items-center gap-3">
//             {!loading && user ? (
//               <>
//                 <div className="flex items-center gap-2 px-3 py-2 bg-bg-secondary rounded-lg">
//                   <User size={16} className="text-primary" />
//                   <span className="text-sm font-semibold text-text-primary">{user.name}</span>
//                 </div>

//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center gap-2 text-danger hover:bg-danger/10 px-3 py-2 rounded-lg font-semibold transition"
//                 >
//                   <LogOut size={18} />
//                   Logout
//                 </button>
//               </>
//             ) : (
//               !loading && (
//                 <>
//                   <Link href="/login" className="btn btn-secondary">
//                     Login
//                   </Link>
//                   <Link href="/register" className="btn btn-primary">
//                     Sign Up
//                   </Link>
//                 </>
//               )
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="md:hidden p-2 text-text-primary hover:bg-bg-secondary rounded-lg"
//           >
//             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden py-4 space-y-2 border-t border-border-color">
//             {!loading && user ? (
//               <>
//                 <Link href="/dashboard" className={navLinkClass('/dashboard')} onClick={() => setMobileMenuOpen(false)}>
//                   <LayoutDashboard size={18} />
//                   Dashboard
//                 </Link>
//                 <Link href="/reports" className={navLinkClass('/reports')} onClick={() => setMobileMenuOpen(false)}>
//                   <FileText size={18} />
//                   Reports
//                 </Link>
//                 <Link href="/reports/create" className="btn btn-primary w-full flex items-center justify-center gap-2" onClick={() => setMobileMenuOpen(false)}>
//                   <Plus size={18} />
//                   New Report
//                 </Link>
//                 <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-danger hover:bg-danger/10">
//                   <LogOut size={18} />
//                   Logout
//                 </button>
//               </>
//             ) : (
//               !loading && (
//                 <>
//                   <Link href="/login" className="btn btn-secondary w-full" onClick={() => setMobileMenuOpen(false)}>
//                     Login
//                   </Link>
//                   <Link href="/register" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>
//                     Sign Up
//                   </Link>
//                 </>
//               )
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }


// 'use client';

// import Link from 'next/link';
// import { useRouter, usePathname } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { LogOut, FileText, LayoutDashboard, Plus, User, Menu, X } from 'lucide-react';

// export default function Navbar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     fetchUser();
//   }, [pathname]);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/auth/me');
//       if (response.status === 401) {
//         setUser(null);
//         return;
//       }
//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.user ?? null);
//       }
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await fetch('/api/auth/logout', { method: 'POST' });
//       toast.success('Logged out');
//       setUser(null);
//       router.push('/');
//       router.refresh();
//     } catch {
//       toast.error('Logout failed');
//     }
//   };

//   const navLinkClass = (path: string) => {
//     const isActive = pathname === path;
//     return `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
//       isActive
//         ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
//         : 'text-text-primary hover:bg-bg-secondary'
//     }`;
//   };

//   return (
//     <nav className="glass  sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
          
//           {/* Logo */}
//           <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 no-underline">
//             <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
//               <FileText className="text-white" size={18} />
//             </div>
//             <span className="text-2xl font-black text-gradient">MyWeekly</span>
//           </Link>

//           {/* Desktop Navigation - xl:flex means 1280px+ */}
//           <div className="hidden xl:flex items-center gap-4">
//             {!loading && user && (
//               <>
//                 <Link href="/dashboard" className={navLinkClass('/dashboard')}>
//                   <LayoutDashboard size={18} />
//                   Dashboard
//                 </Link>

//                 <Link href="/reports" className={navLinkClass('/reports')}>
//                   <FileText size={18} />
//                   Reports
//                 </Link>

//                 <Link href="/reports/create" className="btn btn-primary flex items-center gap-2">
//                   <Plus size={18} />
//                   New Report
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Desktop Right Section */}
//           <div className="hidden xl:flex items-center gap-3">
//             {!loading && user ? (
//               <>
//                 <div className="flex items-center gap-2 px-3 py-2 bg-bg-secondary rounded-lg">
//                   <User size={16} className="text-primary" />
//                   <span className="text-sm font-semibold text-text-primary">{user.name}</span>
//                 </div>

//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center gap-2 text-danger hover:bg-danger/10 px-3 py-2 rounded-lg font-semibold transition"
//                 >
//                   <LogOut size={18} />
//                   Logout
//                 </button>
//               </>
//             ) : (
//               !loading && (
//                 <>
//                   <Link href="/login" className="btn btn-secondary">
//                     Login
//                   </Link>
//                   <Link href="/register" className="btn btn-primary">
//                     Sign Up
//                   </Link>
//                 </>
//               )
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="xl:hidden p-2 text-text-primary hover:bg-bg-secondary rounded-lg"
//           >
//             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="xl:hidden py-4 space-y-2 border-t border-border-color">
//             {!loading && user ? (
//               <>
//                 <Link href="/dashboard" className={navLinkClass('/dashboard')} onClick={() => setMobileMenuOpen(false)}>
//                   <LayoutDashboard size={18} />
//                   Dashboard
//                 </Link>
//                 <Link href="/reports" className={navLinkClass('/reports')} onClick={() => setMobileMenuOpen(false)}>
//                   <FileText size={18} />
//                   Reports
//                 </Link>
//                 <Link href="/reports/create" className="btn btn-primary w-full flex items-center justify-center gap-2" onClick={() => setMobileMenuOpen(false)}>
//                   <Plus size={18} />
//                   New Report
//                 </Link>
//                 <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-danger hover:bg-danger/10">
//                   <LogOut size={18} />
//                   Logout
//                 </button>
//               </>
//             ) : (
//               !loading && (
//                 <>
//                   <Link href="/login" className="btn btn-secondary w-full" onClick={() => setMobileMenuOpen(false)}>
//                     Login
//                   </Link>
//                   <Link href="/register" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>
//                     Sign Up
//                   </Link>
//                 </>
//               )
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }


'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LogOut, FileText, LayoutDashboard, Plus, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/me');
      if (response.status === 401) {
        setUser(null);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setUser(data.user ?? null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out');
      setUser(null);
      router.push('/');
      router.refresh();
    } catch {
      toast.error('Logout failed');
    }
  };

  const navLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
      isActive
        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
        : 'text-text-primary hover:bg-bg-secondary'
    }`;
  };

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 no-underline">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={18} />
            </div>
            <span className="text-2xl font-black text-gradient">MyWeekly</span>
          </Link>

          {/* Desktop Navigation - lg:flex for 1024px+ */}
          <div className="hidden lg:flex items-center gap-4">
            {!loading && user && (
              <>
                <Link href="/dashboard" className={navLinkClass('/dashboard')}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link href="/reports" className={navLinkClass('/reports')}>
                  <FileText size={18} />
                  Reports
                </Link>

                <Link href="/reports/create" className="btn btn-primary flex items-center gap-2">
                  <Plus size={18} />
                  New Report
                </Link>
              </>
            )}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-3">
            {!loading && user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-bg-secondary rounded-lg">
                  <User size={16} className="text-primary" />
                  <span className="text-sm font-semibold text-text-primary">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-danger hover:bg-danger/10 px-3 py-2 rounded-lg font-semibold transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              !loading && (
                <>
                  <Link href="/login" className="btn btn-secondary">
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-text-primary hover:bg-bg-secondary rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-border-color">
            {!loading && user ? (
              <>
                <Link href="/dashboard" className={navLinkClass('/dashboard')} onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link href="/reports" className={navLinkClass('/reports')} onClick={() => setMobileMenuOpen(false)}>
                  <FileText size={18} />
                  Reports
                </Link>
                <Link href="/reports/create" className="btn btn-primary w-full flex items-center justify-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Plus size={18} />
                  New Report
                </Link>
                <div className="pt-4 border-t border-border-color">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <User size={16} className="text-primary" />
                    <span className="text-sm font-semibold text-text-primary">{user.name}</span>
                  </div>
                </div>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-danger hover:bg-danger/10">
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              !loading && (
                <>
                  <Link href="/login" className="btn btn-secondary w-full" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
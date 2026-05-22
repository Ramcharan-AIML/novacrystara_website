// import React, { useState } from 'react';
// import { Menu, X, User, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Menu, X, User, LogOut, LayoutDashboard, UserCircle, Sun, Moon } from 'lucide-react';
import logoImg from '../assets/logo.png';
import logo_1 from '../assets/Main_logo-removebg-preview.png';
import name_logo from '../assets/name_logo-removebg-preview_2.png'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Initialize theme from localStorage or default to dark
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      return stored || 'dark';
    }
    return 'dark';
  });

  // Sync theme changes with documentElement classes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Query authenticated user state
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/user');
      if (!res.ok) throw new Error('Not authenticated');
      return res.json();
    },
    retry: false,
  });

  // Handle Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Logout failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/user'], null);
      queryClient.invalidateQueries();
      setLocation('/');
    },
  });

  const handleNavClick = (targetId) => {
    setIsOpen(false);
    if (location !== '/') {
      setLocation('/');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    setLocation('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /*
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-800/40 bg-slate-950/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          // Logo & Brand
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
            <img src={logo_1} alt="NovaCrystara Brand Logo" className="h-9 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,242,254,0.4)] group-hover:scale-105 transition-all duration-300" />
            <img src={name_logo} alt="NovaCrystara Name Logo" className="h-5 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,242,254,0.4)] group-hover:brightness-110 transition-all duration-300" />
          </div>

          // Desktop Navigation Links
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavClick('technology')} className="text-sm font-medium text-slate-300 hover:text-cyber-cyan transition-colors">
              Programs
            </button>
            <button onClick={() => handleNavClick('why-us')} className="text-sm font-medium text-slate-300 hover:text-cyber-cyan transition-colors">
              Why Us
            </button>
            <button onClick={() => handleNavClick('how-it-works')} className="text-sm font-medium text-slate-300 hover:text-cyber-cyan transition-colors">
              Roadmap
            </button>
            <button onClick={() => handleNavClick('testimonials')} className="text-sm font-medium text-slate-300 hover:text-cyber-cyan transition-colors">
              Alumni
            </button>
          </nav>

          // User Profile / Dashboard / CTAs
          <div className="hidden md:flex items-center gap-4">
            {!isLoading && user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <button className="flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold text-slate-900 bg-gradient-to-r from-cyber-cyan to-cyber-blue border border-cyan-400/25 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_10px_rgba(0,242,254,0.2)]">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </button>
                </Link>

                <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                  <Link href="/profile" className="flex items-center gap-2 group cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-cyber-cyan group-hover:border-cyber-cyan transition-all">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-cyber-cyan transition-colors">
                        {user.firstName}
                      </p>
                      <p className="text-[10px] text-slate-500">Developer</p>
                    </div>
                  </Link>

                  <button
                    onClick={() => logoutMutation.mutate()}
                    className="p-2 ml-2 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('apply')}
                className="px-5 py-2 rounded-md text-xs font-bold font-cyber text-glow-cyan text-cyber-cyan border border-cyber-cyan/30 bg-cyber-cyan/5 hover:bg-cyber-cyan/20 hover:border-cyber-cyan transition-all shadow-[0_0_15px_rgba(0,242,254,0.1)] active:scale-95"
              >
                APPLY NOW
              </button>
            )}
          </div>

          // Mobile Hamburguer Menu
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900/50"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      // Mobile Drawer Dropdown
      {isOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950/95 backdrop-blur-lg animate-fadeIn">
          <div className="space-y-1 px-4 py-3">
            <button
              onClick={() => handleNavClick('technology')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyber-cyan hover:bg-slate-900"
            >
              Programs
            </button>
            <button
              onClick={() => handleNavClick('why-us')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyber-cyan hover:bg-slate-900"
            >
              Why Us
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyber-cyan hover:bg-slate-900"
            >
              Roadmap
            </button>
            <button
              onClick={() => handleNavClick('testimonials')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyber-cyan hover:bg-slate-900"
            >
              Alumni
            </button>

            {user ? (
              <div className="border-t border-slate-800 pt-3 mt-3">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyber-cyan hover:bg-slate-900">
                    <LayoutDashboard className="h-5 w-5 text-cyber-cyan" />
                    Dashboard
                  </div>
                </Link>
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyber-cyan hover:bg-slate-900">
                    <UserCircle className="h-5 w-5 text-cyber-cyan" />
                    My Profile
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logoutMutation.mutate();
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-slate-800 pt-3 mt-3">
                <button
                  onClick={() => handleNavClick('apply')}
                  className="flex w-full justify-center px-4 py-2.5 rounded-md text-center text-sm font-bold font-cyber text-slate-900 bg-gradient-to-r from-cyber-cyan to-cyber-blue shadow-lg"
                >
                  APPLY NOW
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
  */

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/40 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
            <img src={logo_1} alt="NovaCrystara Brand Logo" className="h-9 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,242,254,0.4)] dark:drop-shadow-[0_0_10px_rgba(0,242,254,0.4)] group-hover:scale-105 transition-all duration-300" />
            <img src={name_logo} alt="NovaCrystara Name Logo" className="h-5 w-auto object-contain dark:invert-0 invert group-hover:brightness-110 transition-all duration-300" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavClick('technology')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors">
              Programs
            </button>
            <button onClick={() => handleNavClick('why-us')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors">
              Why Us
            </button>
            <button onClick={() => handleNavClick('how-it-works')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors">
              Roadmap
            </button>
            <button onClick={() => handleNavClick('testimonials')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors">
              Alumni
            </button>
          </nav>

          {/* User Profile / Dashboard / CTAs & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/20 hover:bg-slate-100/60 dark:hover:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyber-cyan transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm dark:shadow-none"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-4.5 w-4.5 text-sky-600 transition-transform duration-500 rotate-0 hover:-rotate-12" />
              ) : (
                <Sun className="h-4.5 w-4.5 text-amber-400 transition-transform duration-500 hover:rotate-45" />
              )}
            </button>

            {!isLoading && user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <button className="flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold text-slate-900 bg-gradient-to-r from-cyber-cyan to-cyber-blue border border-cyan-400/25 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_10px_rgba(0,242,254,0.2)]">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </button>
                </Link>

                <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
                  <Link href="/profile" className="flex items-center gap-2 group cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sky-600 dark:text-cyber-cyan group-hover:border-sky-600 dark:group-hover:border-cyber-cyan transition-all">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-cyber-cyan transition-colors">
                        {user.firstName}
                      </p>
                      <p className="text-[10px] text-slate-500">Developer</p>
                    </div>
                  </Link>

                  <button
                    onClick={() => logoutMutation.mutate()}
                    className="p-2 ml-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-500/10 active:scale-95 transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('apply')}
                className="px-5 py-2 rounded-md text-xs font-bold font-cyber text-sky-600 dark:text-cyber-cyan border border-sky-500/30 dark:border-cyber-cyan/30 bg-sky-500/5 dark:bg-cyber-cyan/5 hover:bg-sky-500/20 dark:hover:bg-cyber-cyan/20 hover:border-sky-500 dark:hover:border-cyber-cyan transition-all shadow-[0_0_15px_rgba(14,165,233,0.1)] dark:shadow-[0_0_15px_rgba(0,242,254,0.1)] active:scale-95"
              >
                APPLY NOW
              </button>
            )}
          </div>

          {/* Mobile Hamburguer Menu */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-900 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg animate-fadeIn">
          <div className="space-y-1 px-4 py-3">
            <button
              onClick={() => handleNavClick('technology')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyber-cyan hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Programs
            </button>
            <button
              onClick={() => handleNavClick('why-us')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyber-cyan hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Why Us
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyber-cyan hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Roadmap
            </button>
            <button
              onClick={() => handleNavClick('testimonials')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyber-cyan hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Alumni
            </button>

            {/* Mobile Theme Toggle */}
            <div className="border-t border-slate-200 dark:border-slate-800/60 pt-3 mt-3 flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Appearance</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyber-cyan hover:bg-slate-100/60 dark:hover:bg-slate-900/50 transition-all duration-300 shadow-sm dark:shadow-none"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4 text-sky-600" />
                    <span className="text-xs font-bold text-sky-600 font-cyber">DARK MODE</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400 font-cyber">LIGHT MODE</span>
                  </>
                )}
              </button>
            </div>

            {user ? (
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-3">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyber-cyan hover:bg-slate-100 dark:hover:bg-slate-900">
                    <LayoutDashboard className="h-5 w-5 text-sky-600 dark:text-cyber-cyan" />
                    Dashboard
                  </div>
                </Link>
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyber-cyan hover:bg-slate-100 dark:hover:bg-slate-900">
                    <UserCircle className="h-5 w-5 text-sky-600 dark:text-cyber-cyan" />
                    My Profile
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logoutMutation.mutate();
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-red-500 dark:text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-3">
                <button
                  onClick={() => handleNavClick('apply')}
                  className="flex w-full justify-center px-4 py-2.5 rounded-md text-center text-sm font-bold font-cyber text-slate-950 dark:text-slate-900 bg-gradient-to-r from-sky-500 via-cyber-cyan to-cyber-blue shadow-lg active:scale-95 transition-all"
                >
                  APPLY NOW
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import React, { useState } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import logo_1 from '../assets/Main_logo-removebg-preview.png';
import name_logo from '../assets/name_logo-removebg-preview_2.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="relative border-t border-slate-200/50 dark:border-slate-900 bg-white/70 dark:bg-slate-950/80 backdrop-blur-md pt-16 pb-8 transition-colors duration-300">
      {/* Decorative cyber line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/35 to-transparent"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Logo & Info */}
          <div className="text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 cursor-pointer group mb-4" onClick={handleScrollToTop}>
                <img src={logo_1} alt="NovaCrystara Brand Logo" className="h-9 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,242,254,0.4)] group-hover:scale-105 transition-all duration-300" />
                <img src={name_logo} alt="NovaCrystara Name Logo" className="h-5 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,242,254,0.4)] group-hover:brightness-110 transition-all duration-300" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                NovaCrystara AI Labs - Empowering the next generation of tech entrepreneurs through hands-on learning and AI-powered education.
              </p>
            </div>
            
            {/* Social channels */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://linkedin.com/company/novacrystara"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyber-cyan hover:border-sky-500 dark:hover:border-cyber-cyan transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              <a
                href="https://twitter.com/novacrystara"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyber-cyan hover:border-sky-500 dark:hover:border-cyber-cyan transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>

              <a
                href="https://github.com/NovaCrystara-AI-Labs"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyber-cyan hover:border-sky-500 dark:hover:border-cyber-cyan transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-left">
            <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#technology" className="text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors duration-200">
                  Programs
                </a>
              </li>
              <li>
                <a href="#technology" className="text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors duration-200">
                  Technology
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors duration-200">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors duration-200">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#apply" className="text-sm text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors duration-200">
                  Apply Now
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="text-left">
            <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-5">
              Contact
            </h4>
            <div className="space-y-4">
              <p className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <Mail className="h-4 w-4 text-sky-600 dark:text-cyber-cyan shrink-0" />
                <a href="mailto:Register@novacrystara.com" className="hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors duration-200">
                  Register@novacrystara.com
                </a>
              </p>
              <p className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <Phone className="h-4 w-4 text-sky-600 dark:text-cyber-cyan shrink-0" />
                <a href="tel:+447767817482" className="hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors duration-200">
                  +447767817482
                </a>
              </p>
              <p className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                <MapPin className="h-4 w-4 text-sky-600 dark:text-cyber-cyan shrink-0 mt-0.5" />
                <span>London, United Kingdom</span>
              </p>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="text-left">
            <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-5">
              Get AI Learning Updates
            </h4>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 focus:border-sky-500 dark:focus:border-cyber-cyan focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-cyber-cyan transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-sm font-bold font-cyber text-white dark:text-slate-950 bg-gradient-to-r from-sky-500 via-cyber-cyan to-cyber-blue shadow-lg shadow-[0_0_15px_rgba(0,242,254,0.3)] dark:shadow-[0_0_15px_rgba(0,242,254,0.2)] hover:brightness-110 active:scale-95 transition-all"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
            <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-3 leading-normal">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>

        </div>

        {/* Bottom Copyright details */}
        <div className="border-t border-slate-200/50 dark:border-slate-900/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-600 text-center sm:text-left leading-normal">
            &copy; {currentYear} NovaCrystara AI Labs Ltd. All rights reserved. Registered in England & Wales.
          </p>
          <div className="flex items-center gap-6">
            <a href="#terms" className="text-xs text-slate-400 dark:text-slate-600 hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors">Terms of Service</a>
            <a href="#privacy" className="text-xs text-slate-400 dark:text-slate-600 hover:text-sky-600 dark:hover:text-cyber-cyan transition-colors">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}


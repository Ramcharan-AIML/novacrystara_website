import React from 'react';
import { Link } from 'wouter';
import { MapPin, Mail } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-900 bg-slate-950/80 backdrop-blur-md pt-12 pb-8">
      {/* Decorative cyber line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/35 to-transparent"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Logo & Corporate Copy */}
          <div className="text-left">
            <div className="flex items-center gap-3 cursor-pointer mb-4" onClick={handleScrollToTop}>
              <img src={logoImg} alt="NovaCrystara Brand Logo" className="h-8 w-8 object-contain drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]" />
              <span className="font-cyber text-base font-bold tracking-widest text-glow-cyan text-cyber-cyan uppercase">
                NovaCrystara
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              Pioneering decentralized AI Agent frameworks and immersive telemetry ecosystems. Empowering tech pioneers globally.
            </p>
          </div>

          {/* Location & Offices */}
          <div className="text-left">
            <h4 className="font-cyber text-xs font-bold text-slate-200 tracking-widest uppercase mb-4">
              HQ OFFICE
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-cyber-cyan shrink-0 mt-0.5" />
                <span>
                  NovaCrystara AI Labs Ltd<br />
                  128 City Road, London<br />
                  EC1V 2NX, United Kingdom
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-cyber-cyan shrink-0" />
                <a href="mailto:labs@novacrystara.com" className="hover:text-cyber-cyan transition-colors">
                  labs@novacrystara.com
                </a>
              </p>
            </div>
          </div>

          {/* Social Channels */}
          <div className="text-left md:text-right">
            <h4 className="font-cyber text-xs font-bold text-slate-200 tracking-widest uppercase mb-4 md:text-right">
              CONNECT
            </h4>
            <div className="flex items-center gap-4 md:justify-end mb-4">
              {/* GitHub custom SVG */}
              <a
                href="https://github.com/NovaCrystara-AI-Labs"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyber-cyan hover:border-cyber-cyan transition-all active:scale-90"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>

              {/* Twitter custom SVG */}
              <a
                href="https://twitter.com/novacrystara"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyber-cyan hover:border-cyber-cyan transition-all active:scale-90"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>

              {/* Discord custom SVG */}
              <a
                href="https://discord.gg/novacrystara"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyber-cyan hover:border-cyber-cyan transition-all active:scale-90"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </a>
            </div>
            <p className="text-xs text-slate-500">
              Innovator Visa Endorsing Partner
            </p>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="border-t border-slate-900/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} NovaCrystara AI Labs Ltd. All rights reserved. Registered in England & Wales.
          </p>
          <div className="flex items-center gap-6">
            <a href="#terms" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#privacy" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

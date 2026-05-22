import React from 'react';
import { Link, Route, Switch } from 'wouter';

// Layout components
import Header from './components/Header';
import Footer from './components/Footer';
import HexagonBackground from './components/HexagonBackground';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ModuleDetail from './pages/ModuleDetail';
import ProjectWorkspace from './pages/ProjectWorkspace';
import Profile from './pages/Profile';

export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. Immersive Custom Canvas & Floating Hexagon particle backgrounds */}
      <HexagonBackground />

      {/* 2. Top-level sticky navigation headers */}
      <Header />

      {/* 3. Primary Client Routing Nodes */}
      <main className="flex-grow pt-16">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/modules/:id" component={ModuleDetail} />
          <Route path="/projects/:id" component={ProjectWorkspace} />
          <Route path="/profile" component={Profile} />
          <Route>
            {/* Fallback 404 router */}
            <div className="mx-auto max-w-md py-20 text-center">
              <h2 className="font-heading text-2xl font-bold text-white mb-2">404: Node Off-Grid</h2>
              <p className="text-sm text-slate-500 mb-6 font-cyber uppercase tracking-widest text-glow-cyan">Unmapped Routing Path</p>
              <Link href="/">
                <button className="px-5 py-2 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  Return to Main Terminal
                </button>
              </Link>
            </div>
          </Route>
        </Switch>
      </main>

      {/* 4. Corporate physical office and copyrights footer */}
      <Footer />

    </div>
  );
}

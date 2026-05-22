import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FolderKanban,
  Award,
  BookOpen,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  X,
  FileSpreadsheet,
  AwardIcon,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Create Project Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectModule, setProjectModule] = useState('');

  // Selected Certificate detail modal
  const [selectedCert, setSelectedCert] = useState(null);

  // 1. Fetch User Profile
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/user');
      if (!res.ok) {
        setLocation('/'); // Redirect if unauthorized
        throw new Error('Not authenticated');
      }
      return res.json();
    }
  });

  // 2. Fetch Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    enabled: !!user
  });

  // 3. Fetch Enrolled Courses (enrollments)
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['/api/enrollments'],
    queryFn: async () => {
      const res = await fetch('/api/enrollments');
      if (!res.ok) throw new Error('Failed to fetch enrollments');
      return res.json();
    },
    enabled: !!user
  });

  // 4. Fetch Projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
    enabled: !!user
  });

  // 5. Fetch Certifications
  const { data: certifications = [], isLoading: certsLoading } = useQuery({
    queryKey: ['/api/certifications'],
    queryFn: async () => {
      const res = await fetch('/api/certifications');
      if (!res.ok) throw new Error('Failed to fetch certifications');
      return res.json();
    },
    enabled: !!user
  });

  // 6. Fetch Modules list to map module names
  const { data: modules = [] } = useQuery({
    queryKey: ['/api/modules'],
    queryFn: async () => {
      const res = await fetch('/api/modules');
      if (!res.ok) throw new Error('Failed to fetch modules');
      return res.json();
    }
  });

  // Create Project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (newProj) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProj)
      });
      if (!res.ok) throw new Error('Failed to create project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setIsModalOpen(false);
      setProjectTitle('');
      setProjectDesc('');
      setProjectModule('');
    }
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projectTitle || !projectModule) {
      alert("Please fill in the project title and select a module.");
      return;
    }
    createProjectMutation.mutate({
      title: projectTitle,
      description: projectDesc,
      moduleId: projectModule
    });
  };

  // Map enrolled module IDs to full module data
  const enrolledModules = modules.filter(m =>
    enrollments.some(e => e.moduleId === m.id)
  );

  const getModuleName = (moduleId) => {
    const m = modules.find(x => x.id === moduleId);
    return m ? m.title : "Unknown Program";
  };

  const isMainLoading = userLoading || statsLoading || enrollmentsLoading || projectsLoading || certsLoading;

  if (isMainLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-left">
        {/* Banner Skeleton */}
        <div className="h-28 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse mb-8"></div>
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="h-24 rounded-xl bg-slate-900 border border-slate-800 animate-pulse"></div>
          ))}
        </div>
        {/* Main Columns Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-60 rounded-xl bg-slate-900 border border-slate-800 animate-pulse"></div>
            <div className="h-60 rounded-xl bg-slate-900 border border-slate-800 animate-pulse"></div>
          </div>
          <div className="h-80 rounded-xl bg-slate-900 border border-slate-800 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* 1. WELCOME HERO CARDS BANNER */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl cyber-glass mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-xl">
        <div className="absolute top-0 right-0 h-32 w-32 bg-cyber-cyan/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold text-cyber-cyan border border-cyber-cyan/20 bg-cyber-cyan/5 uppercase font-cyber mb-3">
            <Activity className="h-3 w-3" /> Live Terminal Feed
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            You are authenticated on cohort nodes. Track your telemetry, complete active project code scopes, and review your cryptographical credentials.
          </p>
        </div>
        <button
          onClick={() => {
            if (enrolledModules.length === 0) {
              alert("Please enroll in a module first!");
              return;
            }
            // Auto-select first enrolled module in create project modal
            setProjectModule(enrolledModules[0].id);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold font-cyber text-slate-900 bg-gradient-to-r from-cyber-cyan to-cyber-blue shadow-lg active:scale-95 transition-all hover:brightness-110 shrink-0"
        >
          <Plus className="h-4 w-4" />
          CREATE MOCK PROJECT
        </button>
      </div>

      {/* 2. REAL-TIME STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Metric 1 */}
        <div className="p-4 rounded-xl cyber-glass">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-cyber">Enrolled Modules</span>
            <BookOpen className="h-4 w-4 text-cyber-cyan" />
          </div>
          <p className="font-cyber text-xl sm:text-2xl font-bold text-white text-glow-cyan">
            {stats?.enrolledCount || 0}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl cyber-glass">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-cyber">Active Projects</span>
            <FolderKanban className="h-4 w-4 text-cyber-blue" />
          </div>
          <p className="font-cyber text-xl sm:text-2xl font-bold text-white text-glow-cyan">
            {stats?.activeCount || 0}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl cyber-glass">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-cyber">Overall Progress</span>
            <TrendingUp className="h-4 w-4 text-cyber-cyan" />
          </div>
          <p className="font-cyber text-xl sm:text-2xl font-bold text-white text-glow-cyan">
            {stats?.averageProgress || 0}%
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl cyber-glass-purple">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-cyber">Digital Credentials</span>
            <Award className="h-4 w-4 text-cyber-purple animate-pulse-slow" />
          </div>
          <p className="font-cyber text-xl sm:text-2xl font-bold text-white text-glow-purple">
            {stats?.certificationsCount || 0}
          </p>
        </div>

      </div>

      {/* 3. MAIN CONTENTS COLUMNS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Enrolled modules & Project Portfolio */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* A. ENROLLED MODULES SECTION */}
          <div>
            <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan"></span>
              Enrolled Tech Programs
            </h3>

            {enrolledModules.length === 0 ? (
              <div className="p-8 text-center rounded-xl cyber-glass">
                <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-300">No active program enrollments</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">Go to the homepage and select a program to begin.</p>
                <Link href="/">
                  <button className="px-4 py-1.5 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20 text-xs font-bold">
                    EXPLORE PROGRAMS
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {enrolledModules.map((m) => (
                  <div key={m.id} className="p-5 rounded-xl cyber-glass flex flex-col justify-between hover-elevate">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[8px] font-bold text-cyber-cyan bg-cyber-cyan/5 border border-cyber-cyan/20">
                          {m.level}
                        </span>
                        <span className="text-[10px] text-slate-500 font-cyber">{m.duration}</span>
                      </div>
                      <h4 className="font-bold text-white text-base text-left mb-1">{m.title}</h4>
                      <p className="text-xs text-slate-400 text-left line-clamp-2 leading-relaxed">{m.description}</p>
                    </div>

                    <div className="border-t border-slate-900/60 pt-4 flex items-center justify-between mt-4">
                      <Link href={`/modules/${m.id}`} className="text-xs text-slate-400 hover:text-cyber-cyan transition-colors">
                        Review Syllabus Detail
                      </Link>
                      <Link href={`/modules/${m.id}`}>
                        <button className="px-3 py-1 rounded text-[10px] font-bold font-cyber text-slate-900 bg-cyber-cyan flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all">
                          CONTINUE <ArrowRight className="h-3 w-3" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* B. USER'S PROJECTS PORFOLIO */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyber-blue"></span>
                My Project Workspace Portfolio
              </h3>
            </div>

            {projects.length === 0 ? (
              <div className="p-8 text-center rounded-xl cyber-glass">
                <FolderKanban className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-300">No projects generated yet</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">Initialize a new project using the simulator to start building telemetry tracks.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-1.5 rounded bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/20 text-xs font-bold"
                >
                  CREATE NEW PROJECT
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((p) => {
                  const isCompleted = p.status === 'completed';
                  return (
                    <div key={p.id} className="p-5 rounded-xl cyber-glass hover:border-cyber-cyan/40 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[8px] font-bold text-slate-500 bg-slate-900 border border-slate-800 uppercase tracking-widest font-cyber">
                            {getModuleName(p.moduleId)}
                          </span>
                          <h4 className="font-bold text-white text-base text-left mt-1.5">{p.title}</h4>
                        </div>
                        <span className={`self-start sm:self-auto px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-cyber border ${
                          isCompleted
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                            : "bg-cyber-blue/10 text-cyber-blue border-cyber-blue/25"
                        }`}>
                          {p.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 text-left line-clamp-2 mb-4 leading-relaxed">
                        {p.description}
                      </p>

                      {/* Progress slider display bar */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs font-cyber">
                          <span className="text-slate-500">Node Completion Telemetry</span>
                          <span className="text-cyber-cyan font-bold">{p.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800/40">
                          <div
                            className="bg-gradient-to-r from-cyber-cyan to-cyber-blue h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${p.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-900/60 pt-4">
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          Generated on {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                        
                        <Link href={`/projects/${p.id}`}>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold text-cyber-cyan hover:bg-cyber-cyan/5 active:scale-95 transition-all">
                            Open Workspace
                            <ArrowUpRight className="h-4 w-4" />
                          </button>
                        </Link>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Credentials & Digital certificates portfolio */}
        <div className="space-y-8">
          <div>
            <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyber-purple"></span>
              Digital Credentials
            </h3>

            {certifications.length === 0 ? (
              <div className="p-6 text-center rounded-xl cyber-glass-purple">
                <Award className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-300">Credentials Empty</p>
                <p className="text-xs text-slate-500 mt-1">
                  Perfect active project progress completion ratios to 100% to automatically generate cryptography badges.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {certifications.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCert(c)}
                    className="p-4 rounded-xl cyber-glass-purple cursor-pointer hover:border-cyber-purple transition-all group flex gap-3.5 items-start text-left shadow-lg"
                  >
                    <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded bg-cyber-purple/10 border border-cyber-purple/25 text-cyber-purple group-hover:scale-105 transition-transform">
                      <AwardIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs leading-tight group-hover:text-cyber-purple transition-colors">
                        Verified {c.moduleTitle} Certification
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">
                        ID: {c.credentialId}
                      </p>
                      <span className="inline-block mt-2.5 text-[9px] font-semibold text-cyber-cyan bg-cyber-cyan/5 border border-cyber-cyan/25 px-1.5 py-0.5 rounded uppercase font-cyber tracking-wider">
                        VIEW CREDENTIAL
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. MODAL DIALOG: CREATE NEW MOCK PROJECT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl border border-cyber-cyan/15 bg-slate-950 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-heading text-lg font-extrabold text-white mb-1.5 text-left">
              Create New Mock Project
            </h3>
            <p className="text-xs text-slate-400 text-left mb-6">
              Create a custom code objective to validate specific technological tracks.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Multi-Agent RAG Orchestrator"
                  className="w-full px-3 py-2 text-sm text-slate-200 bg-slate-900 border border-slate-800 rounded focus:border-cyber-cyan focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  rows="3"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Summarize the core technical features and telemetry scopes of this project..."
                  className="w-full px-3 py-2 text-sm text-slate-200 bg-slate-900 border border-slate-800 rounded focus:border-cyber-cyan focus:outline-none transition-colors"
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Associated Program Node
                </label>
                <select
                  required
                  value={projectModule}
                  onChange={(e) => setProjectModule(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-slate-200 bg-slate-900 border border-slate-800 rounded focus:border-cyber-cyan focus:outline-none transition-colors"
                >
                  <option value="">-- Choose Module --</option>
                  {enrolledModules.map(em => (
                    <option key={em.id} value={em.id}>{em.title}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={createProjectMutation.isPending}
                className="w-full py-2.5 rounded text-xs font-bold font-cyber text-slate-900 bg-gradient-to-r from-cyber-cyan to-cyber-blue shadow-lg hover:brightness-110 transition-all active:scale-95 flex items-center justify-center"
              >
                {createProjectMutation.isPending ? "COMPILING PROJECT..." : "GENERATE WORKSPACE SLOT"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL DIALOG: VIEW DIGITAL CERTIFICATE CREDENTIAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-8 rounded-2xl border border-cyber-purple/20 bg-gradient-to-b from-slate-950 to-slate-900 shadow-2xl relative overflow-hidden text-center">
            
            {/* Holographic background traces */}
            <div className="absolute top-0 right-0 h-44 w-44 bg-cyber-purple/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-cyber-cyan/5 rounded-full blur-3xl -z-10"></div>

            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Glowing Medal Badge Icon */}
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-cyber-purple/15 border-2 border-cyber-purple/40 text-cyber-purple shadow-[0_0_20px_rgba(127,0,255,0.3)] mb-6 animate-pulse-slow">
              <AwardIcon className="h-10 w-10" />
            </div>

            <span className="font-cyber text-[10px] font-extrabold tracking-widest text-cyber-cyan border border-cyber-cyan/20 bg-cyber-cyan/5 px-2.5 py-0.5 rounded uppercase">
              NovaCrystara Engineering Guild
            </span>

            <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white mt-4 mb-2">
              Verified {selectedCert.moduleTitle} Mastery
            </h3>
            
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
              This cryptographical document confirms that the holder has successfully perfect-completed 100% of the active capstone workspace telemetry project modules.
            </p>

            {/* Credential ID and Date Box */}
            <div className="mx-auto max-w-sm p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-left space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">CREDENTIAL ID:</span>
                <span className="text-slate-300 font-bold">{selectedCert.credentialId}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">HOLDER:</span>
                <span className="text-slate-300 font-bold">{user?.firstName} {user?.lastName}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">TIMESTAMP:</span>
                <span className="text-slate-300 font-bold">{new Date(selectedCert.unlockedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">ENDORSER:</span>
                <span className="text-cyber-cyan font-bold uppercase font-cyber tracking-wider">NOVACRYSTARA AI LABS</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-600 mt-6 font-cyber uppercase tracking-widest">
              Secured with SHA-256 Ledger Tracing
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

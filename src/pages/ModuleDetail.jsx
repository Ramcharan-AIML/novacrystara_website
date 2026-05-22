import React from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function ModuleDetail({ params }) {
  const moduleId = params.id;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // 1. Fetch Module Details
  const { data: module, isLoading: moduleLoading, error } = useQuery({
    queryKey: ['/api/modules', moduleId],
    queryFn: async () => {
      const res = await fetch(`/api/modules/${moduleId}`);
      if (!res.ok) throw new Error('Module not found');
      return res.json();
    }
  });

  // 2. Fetch User Profile
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/user');
      if (!res.ok) throw new Error('Not logged in');
      return res.json();
    },
    retry: false
  });

  // 3. Fetch User Enrollments
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['/api/enrollments'],
    queryFn: async () => {
      const res = await fetch('/api/enrollments');
      if (!res.ok) throw new Error('Failed to fetch enrollments');
      return res.json();
    },
    enabled: !!user
  });

  // Enroll Mutation
  const enrollMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId })
      });
      if (!res.ok) throw new Error('Failed to enroll');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setLocation('/dashboard');
    }
  });

  const isEnrolled = enrollments.some(e => e.moduleId === moduleId);
  const isComing = module?.status === 'Coming Soon';

  const handleActionClick = () => {
    if (isComing) return;

    if (!user) {
      // Simulate quick login for faster testing flow
      const mockUser = {
        id: "user_1",
        firstName: "Sarah",
        lastName: "Chen",
        bio: "AI Researcher and automation enthusiast. Building next-generation digital workers.",
        email: "sarah.chen@techcorp.com"
      };
      localStorage.setItem("nc_user", JSON.stringify(mockUser));
      queryClient.setQueryData(['/api/auth/user'], mockUser);
      
      // Perform enrollment
      enrollMutation.mutate();
    } else if (!isEnrolled) {
      enrollMutation.mutate();
    } else {
      setLocation('/dashboard');
    }
  };

  if (moduleLoading || enrollmentsLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-left">
        <div className="h-6 w-24 bg-slate-900 rounded animate-pulse mb-6"></div>
        <div className="h-32 bg-slate-900 rounded animate-pulse mb-8"></div>
        <div className="h-64 bg-slate-900 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Program Module Not Found</h3>
        <p className="text-sm text-slate-500 mb-6">The technical node you requested is unregistered.</p>
        <Link href="/">
          <button className="px-5 py-2 rounded bg-slate-900 text-slate-300 border border-slate-800">
            Return Home
          </button>
        </Link>
      </div>
    );
  }

  const levelColors = {
    Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    Advanced: "bg-rose-500/10 text-rose-400 border-rose-500/25"
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Back button link */}
      <Link href={user ? "/dashboard" : "/"}>
        <button className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyber-cyan transition-colors mb-6 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          BACK TO {user ? "DASHBOARD" : "HOMEPAGE"}
        </button>
      </Link>

      {/* 1. MODULE BANNER OVERVIEW */}
      <div className="p-6 sm:p-8 rounded-2xl cyber-glass relative overflow-hidden shadow-xl mb-8">
        <div className="absolute top-0 right-0 h-32 w-32 bg-cyber-cyan/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${levelColors[module.level]}`}>
                {module.level}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-cyber text-slate-400">
                <Clock className="h-3.5 w-3.5 text-cyber-cyan" />
                {module.duration || "8 Weeks"}
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              {module.title} Curriculum
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              {module.description}
            </p>
          </div>

          {/* <button
            onClick={handleActionClick}
            disabled={isComing}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-bold font-cyber shrink-0 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isComing
                ? "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
                : isEnrolled
                ? "bg-slate-900 text-cyber-cyan border border-cyber-cyan/35 hover:bg-cyber-cyan/10"
                : "bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-900 hover:brightness-110"
            }`}
          >
            {isComing ? "COMING SOON" : isEnrolled ? "CONTINUE TO WORKSPACE" : "ENROLL IN PROGRAM"}
            {!isComing && <ArrowRight className="h-3.5 w-3.5" />}
          </button> */}
        </div>
      </div>

      {/* 2. CHRONOLOGICAL WEEKLY SYLLABUS LIST */}
      <div>
        <h3 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Layers className="h-5 w-5 text-cyber-cyan" />
          Syllabus Milestones & Scope
        </h3>

        {module.syllabus && module.syllabus.length > 0 ? (
          <div className="space-y-6 relative border-l border-slate-900 ml-4 pl-6">
            
            {module.syllabus.map((s, idx) => (
              <div key={idx} className="relative group">
                
                {/* Visual Circle Node indicators */}
                <div className="absolute -left-[31px] top-1.5 h-4.5 w-4.5 rounded-full bg-slate-950 border-2 border-cyber-cyan shadow-[0_0_8px_#00f2fe] z-10 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyber-cyan"></div>
                </div>

                <div className="p-5 rounded-xl cyber-glass hover:border-cyber-cyan/30 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className="font-cyber text-xs font-bold text-cyber-cyan uppercase tracking-wider">
                      {s.week}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Telemetry Node {idx+1}</span>
                  </div>

                  <h4 className="font-bold text-white text-base text-left mb-3">
                    {s.title}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 border-t border-slate-900/60 pt-4">
                    {s.topics.map((t, tIdx) => (
                      <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-400 text-left">
                        <GraduationCap className="h-3.5 w-3.5 text-cyber-cyan shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="p-8 text-center rounded-xl cyber-glass">
            <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">Syllabus Details Compiling</p>
            <p className="text-xs text-slate-500 mt-1">This module is currently being finalized by lab architects.</p>
          </div>
        )}
      </div>

    </div>
  );
}

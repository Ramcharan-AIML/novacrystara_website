import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Settings,
  TrendingUp,
  Cpu,
  Save,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Trophy,
  AwardIcon,
  Play
} from 'lucide-react';

export default function ProjectWorkspace({ params }) {
  const projectId = params.id;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [sliderVal, setSliderVal] = useState(0);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // 1. Fetch Project Details
  const { data: project, isLoading: projectLoading, error } = useQuery({
    queryKey: ['/api/projects', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error('Project not found');
      return res.json();
    }
  });

  // 2. Fetch associated Module detail (enabled after project is loaded)
  const { data: module } = useQuery({
    queryKey: ['/api/modules', project?.moduleId],
    queryFn: async () => {
      const res = await fetch(`/api/modules/${project.moduleId}`);
      if (!res.ok) throw new Error('Failed to fetch module');
      return res.json();
    },
    enabled: !!project?.moduleId
  });

  // Sync local slider value with database value once loaded
  useEffect(() => {
    if (project) {
      setSliderVal(project.progress);
    }
  }, [project]);

  // Mutation to update progress
  const updateProgressMutation = useMutation({
    mutationFn: async (updatedFields) => {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (!res.ok) throw new Error('Failed to update progress');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/certifications'] });

      if (data.progress === 100 && data.status === 'completed') {
        setShowCelebrationModal(true);
      } else {
        alert("Project telemetry progress updated successfully!");
      }
    }
  });

  const handleSaveProgress = () => {
    updateProgressMutation.mutate({ progress: Number(sliderVal) });
  };

  const handleMarkComplete = () => {
    updateProgressMutation.mutate({ progress: 100, status: 'completed' });
  };

  if (projectLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-left animate-pulse">
        <div className="h-6 w-24 bg-slate-900 rounded mb-6"></div>
        <div className="h-32 bg-slate-900 rounded mb-8"></div>
        <div className="h-44 bg-slate-900 rounded"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Workspace Slot Not Found</h3>
        <p className="text-sm text-slate-500 mb-6 font-cyber uppercase tracking-widest text-glow-cyan">Unregistered Telemetry Slot</p>
        <Link href="/dashboard">
          <button className="px-5 py-2 rounded bg-slate-900 text-slate-300 border border-slate-800">
            Return to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  const isCompleted = project.status === 'completed';

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Back link */}
      <Link href="/dashboard">
        <button className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyber-cyan transition-colors mb-6 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          BACK TO WORKSPACE DASHBOARD
        </button>
      </Link>

      {/* 1. PROJECT TITLE BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl cyber-glass relative overflow-hidden shadow-xl mb-8">
        <div className="absolute top-0 right-0 h-32 w-32 bg-cyber-blue/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="px-2 py-0.5 rounded text-[8px] font-bold text-cyber-cyan bg-cyber-cyan/5 border border-cyber-cyan/20 uppercase tracking-widest font-cyber">
              {module?.title || "Active Capstone"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              {project.title}
            </h2>
            <p className="text-xs text-slate-500 font-cyber flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-cyber-cyan" /> Registered: {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>

          <span className={`self-start sm:self-auto px-3 py-1 rounded text-xs font-bold uppercase tracking-wider font-cyber border ${
            isCompleted
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 text-glow-cyan shadow-[0_0_10px_rgba(16,185,129,0.15)]"
              : "bg-cyber-blue/10 text-cyber-blue border-cyber-blue/25"
          }`}>
            {project.status}
          </span>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed mt-4 pt-4 border-t border-slate-900/60">
          {project.description}
        </p>
      </div>

      {/* 2. PROGRESS TUNER SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Progress Slider and Telemetry controls */}
        <div className="md:col-span-2 p-6 rounded-xl cyber-glass space-y-6">
          <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
            <Settings className="h-4 w-4 text-cyber-cyan" />
            Telemetry Completion Controls
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Drag the tuner interface below to update your completed code blocks. Move the slider to 100% to finalize your capstone node.
          </p>

          {/* DRAG PROGRESS SLIDER (slider-progress) */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between text-sm font-cyber">
              <span className="text-slate-500">Tuner Ratio</span>
              <span className="text-cyber-cyan font-bold text-base">{sliderVal}%</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              disabled={isCompleted}
              value={sliderVal}
              onChange={(e) => setSliderVal(e.target.value)}
              className="slider-progress w-full cursor-pointer disabled:opacity-50"
            />
            
            <div className="flex justify-between text-[10px] text-slate-600 font-mono">
              <span>0% (INIT)</span>
              <span>50% (ALPHA)</span>
              <span>100% (STABLE)</span>
            </div>
          </div>

          <div className="border-t border-slate-900/60 pt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button
              onClick={handleSaveProgress}
              disabled={isCompleted || updateProgressMutation.isPending || Number(sliderVal) === project.progress}
              className="w-full sm:w-auto px-6 py-2.5 rounded text-xs font-bold font-cyber text-slate-300 border border-slate-700 bg-slate-900/50 hover:bg-slate-900 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              SAVE INTERMEDIATE TELEMETRY
            </button>

            {Number(sliderVal) === 100 && !isCompleted && (
              <button
                onClick={handleMarkComplete}
                className="w-full sm:w-auto px-6 py-2.5 rounded text-xs font-bold font-cyber text-slate-900 bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                MARK MODULE AS COMPLETED
              </button>
            )}

            {isCompleted && (
              <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 uppercase font-cyber tracking-widest">
                <CheckCircle2 className="h-4 w-4" /> Node Complete & Certified
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Lab Instructions */}
        <div className="p-6 rounded-xl cyber-glass space-y-4">
          <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyber-blue" />
            Lab Guidelines
          </h3>
          <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
            <p>
              <span className="font-semibold text-slate-200">1. Setup Repo:</span> Initialize your workspace directory on local folders.
            </p>
            <p>
              <span className="font-semibold text-slate-200">2. Run telemetry checks:</span> Ensure all connections resolve with correct API parameters.
            </p>
            <p>
              <span className="font-semibold text-slate-200">3. Perfect milestones:</span> Update code blocks to complete all features.
            </p>
            <p>
              <span className="font-semibold text-slate-200">4. Final Verification:</span> Once perfect, drag the tuner to 100% and generate your cryptographical badge.
            </p>
          </div>
        </div>

      </div>

      {/* 3. CELEBRATION UNLOCK CONGRATULATIONS DIALOG */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-8 rounded-2xl border border-cyber-cyan/20 bg-gradient-to-b from-slate-950 to-slate-900 shadow-2xl relative text-center overflow-hidden">
            
            {/* Holographic glowing backgrounds */}
            <div className="absolute top-0 right-0 h-36 w-36 bg-cyber-cyan/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-cyber-cyan/15 border-2 border-cyber-cyan/40 text-cyber-cyan shadow-[0_0_20px_rgba(0,242,254,0.3)] mb-6 animate-bounce">
              <Trophy className="h-10 w-10" />
            </div>

            <span className="font-cyber text-[10px] font-extrabold tracking-widest text-cyber-cyan border border-cyber-cyan/20 bg-cyber-cyan/5 px-2.5 py-0.5 rounded uppercase">
              Milestone Accomplished!
            </span>

            <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white mt-4 mb-2">
              Congratulations!
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto mb-6">
              You have completed 100% of <span className="text-white font-semibold">"{project.title}"</span> code scopes and successfully unlocked your verified course credential!
            </p>

            <button
              onClick={() => {
                setShowCelebrationModal(false);
                setLocation('/dashboard');
              }}
              className="w-full py-2.5 rounded text-xs font-bold font-cyber text-slate-900 bg-gradient-to-r from-cyber-cyan to-cyber-blue shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <AwardIcon className="h-4 w-4" />
              COLLECT DIGITAL CREDENTIAL
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

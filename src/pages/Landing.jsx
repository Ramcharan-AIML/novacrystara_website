import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles,
  TrendingUp,
  Cpu,
  Users,
  Compass,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle,
  Clock,
  UserCheck,
  ChevronRight,
  HelpCircle,
  FileText,
  Zap,
  Target,
  Shield,
  Globe,
  GraduationCap,
  Brain,
  Briefcase,
  Lightbulb,
  Award
} from 'lucide-react';
import heroBgImg from '../assets/hero_bg.png';
import logoImg from '../assets/logo.png';
import Main_logo from '../assets/Main_logo-removebg-preview.png'

// Testimonials data extracted from index.js
const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "AI Engineer at TechCorp",
    initials: "SC",
    quote: "The hands-on projects gave me the confidence to excel in my interviews. I landed my dream job within weeks of completing the program.",
    skills: ["AI Agents", "Data Engineering"]
  },
  {
    name: "Marcus Johnson",
    role: "Startup Founder",
    initials: "MJ",
    quote: "The Innovator Visa support was invaluable. They helped me develop a solid business model and navigate the application process successfully.",
    skills: ["Business Model", "Scrum Master"]
  },
  {
    name: "Priya Patel",
    role: "Cloud Architect",
    initials: "PP",
    quote: "Learning from industry experts while working on real projects was exactly what I needed to transition into tech. Highly recommend!",
    skills: ["Multi Cloud", "IoT"]
  },
  {
    name: "Alex Rivera",
    role: "Data Analyst",
    initials: "AR",
    quote: "The AI-powered learning path adapted to my schedule perfectly. I could learn at my own pace while still hitting all my milestones.",
    skills: ["Data Analytics", "PM"]
  }
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Testimonial Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Form Registration States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedModule, setSelectedModule] = useState('ai-agents');
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const fileInputRef = useRef(null);

  // Simulated Login State for fast testing
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch modules/courses
  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ['/api/modules'],
    queryFn: async () => {
      const res = await fetch('/api/modules');
      if (!res.ok) throw new Error('Failed to fetch modules');
      return res.json();
    }
  });

  // Query authenticated user state
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/user');
      if (!res.ok) throw new Error('Not logged in');
      return res.json();
    },
    retry: false
  });

  // Mock enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async (moduleId) => {
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

  // Testimonials Auto-scroll
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Handle resume uploading (interacts with /api/objects/upload)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Please upload a file smaller than 10MB");
      return;
    }

    setResumeFile(file);
    setIsUploading(true);

    try {
      // Step 1: POST to fetch mock signed URL / upload destination
      const upRes = await fetch('/api/objects/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type })
      });
      const upData = await upRes.json();

      // Simulate uploading binary file (simulate delay)
      await new Promise((resolve) => setTimeout(resolve, 800));

      setUploadedUrl(upData.url);
    } catch (err) {
      console.error("Mock Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  // Submit registration (interacts with /api/registrations)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert("Please fill in your name and email.");
      return;
    }

    try {
      const regRes = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          moduleId: selectedModule,
          resumeUrl: uploadedUrl
        })
      });

      if (regRes.ok) {
        setIsRegistered(true);
        // Automatically mock-authenticate the registered user for testing convenience!
        /*
        const mockUser = {
          id: `user_${Date.now()}`,
          firstName: fullName.split(' ')[0] || "Innovator",
          lastName: fullName.split(' ').slice(1).join(' ') || "Labs",
          bio: `Joined NovaCrystara seeking ${selectedModule.toUpperCase()} mastery.`,
          email: email
        };
        localStorage.setItem("nc_user", JSON.stringify(mockUser));
        queryClient.setQueryData(['/api/auth/user'], mockUser);

        // Pre-enroll in their selected module
        const mockEnrollments = JSON.parse(localStorage.getItem("nc_enrollments") || "[]");
        mockEnrollments.push({
          id: `enroll_${Date.now()}`,
          moduleId: selectedModule,
          enrolledAt: new Date().toISOString()
        });
        localStorage.setItem("nc_enrollments", JSON.stringify(mockEnrollments));

        // Invalidate queries so that header states reactively update
        queryClient.invalidateQueries();
        */
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnrollClick = (moduleId, status) => {
    if (status === 'Coming Soon') return;

    if (user) {
      enrollMutation.mutate(moduleId);
    } else {
      // Scroll to apply form
      const formEl = document.getElementById('apply');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simulate Instant login for testing
  const handleQuickLogin = () => {
    const mockUser = {
      id: "user_1",
      firstName: "Sarah",
      lastName: "Chen",
      bio: "AI Researcher and automation enthusiast. Building next-generation digital workers.",
      email: "sarah.chen@techcorp.com"
    };
    localStorage.setItem("nc_user", JSON.stringify(mockUser));
    queryClient.setQueryData(['/api/auth/user'], mockUser);
    queryClient.invalidateQueries();
    setLocation('/dashboard');
  };

  return (
    <div className="relative min-h-screen text-slate-200">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 border-b border-slate-900">
        
        {/* Background Trace Graphic */}
        <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-30 hero-bg-image" style={{ backgroundImage: `url(${heroBgImg})` }}></div>
        <div className="absolute inset-0 -z-10 bg-slate-950/65"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative">
          
          {/* Glowing brand metallic logo floating */}
          <div className="flex justify-center mb-6">
            <div className="relative p-2.5 rounded-3xl bg-slate-900/60 border border-cyber-cyan/35 shadow-[0_0_30px_rgba(0,242,254,0.2)] animate-float-medium">
              <img src={Main_logo} alt="NovaCrystara Hex Logo" className="h-16 w-16 object-contain" />
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyber-cyan to-cyber-blue opacity-30 blur"></div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-cyber-cyan border border-cyber-cyan/20 bg-cyber-cyan/5 uppercase font-cyber mb-4">
            <Sparkles className="h-3 w-3" /> AI & Telemetry Labs
          </span>

          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Build the Future of <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-blue text-glow-cyan">
              Intelligent Automation
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 mb-8 leading-relaxed">
            Reinvent your technical expertise in a world powered by AI Agents. Build deep capstone telemetry architectures and secure prestigious global tech partnerships.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('apply');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-bold font-cyber text-slate-900 bg-gradient-to-r from-cyber-cyan to-cyber-blue shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:brightness-110 active:scale-95 transition-all"
            >
              APPLY FOR COHORT
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('technology');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-bold font-cyber text-slate-300 border border-slate-700 bg-slate-900/50 hover:bg-slate-900 hover:text-white active:scale-95 transition-all"
            >
              EXPLORE PROGRAMS
            </button>
            {/* <button
              onClick={handleQuickLogin}
              className="w-full sm:w-auto px-5 py-3 rounded-lg text-xs font-bold text-slate-400 bg-slate-950 border border-slate-800 hover:border-cyber-cyan hover:text-cyber-cyan transition-all active:scale-95"
            >
              SIMULATE LOGIN
            </button> */}
          </div>

          {/* Quick Metrics Overlay */}
          <div className="mx-auto max-w-4xl mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl border border-slate-900 bg-slate-950/70 backdrop-blur-md">
            <div>
              <p className="font-cyber text-2xl font-bold text-white text-glow-cyan">98%</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Placement Rate</p>
            </div>
            <div className="border-l border-slate-900 pl-4">
              <p className="font-cyber text-2xl font-bold text-white text-glow-cyan">150+</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Projects Built</p>
            </div>
            <div className="border-l border-slate-900 pl-4">
              <p className="font-cyber text-2xl font-bold text-white text-glow-cyan">100%</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Hands-on Lab</p>
            </div>
            <div className="border-l border-slate-900 pl-4">
              <p className="font-cyber text-2xl font-bold text-white text-glow-cyan">London</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">HQ Corporate Hub</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. WHY CHOOSE US FEATURE CARDS */}
      <section id="why-us" className="py-20 border-b border-slate-900 bg-slate-950/45">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-cyber tracking-wider mb-4">
              Modern Business Model Development
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Why Choose NovaCrystara
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
              We combine cutting-edge technology with proven methodologies to deliver results that matter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Agile Methodologies */}
            <div className="flex items-start gap-4 p-6 rounded-xl cyber-glass hover-elevate text-left">
              <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/35 text-cyber-cyan shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Agile Methodologies</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Learn modern development practices used by top tech companies.
                </p>
              </div>
            </div>

            {/* Card 2: Data-Driven Decisions */}
            <div className="flex items-start gap-4 p-6 rounded-xl cyber-glass-purple hover-elevate-purple text-left">
              <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-cyber-purple/10 border border-cyber-purple/35 text-cyber-purple shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Data-Driven Decisions</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Master analytics and make informed business decisions.
                </p>
              </div>
            </div>

            {/* Card 3: Scalable Startups */}
            <div className="flex items-start gap-4 p-6 rounded-xl cyber-glass hover-elevate text-left">
              <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/35 text-cyber-cyan shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Scalable Startups</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Build products that can grow from zero to millions of users.
                </p>
              </div>
            </div>

            {/* Card 4: 100% Work Confidence */}
            <div className="flex items-start gap-4 p-6 rounded-xl cyber-glass-purple hover-elevate-purple text-left">
              <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-cyber-purple/10 border border-cyber-purple/35 text-cyber-purple shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">100% Work Confidence</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Graduate job-ready with practical experience under your belt.
                </p>
              </div>
            </div>

            {/* Card 5: Real-Time Projects */}
            <div className="flex items-start gap-4 p-6 rounded-xl cyber-glass hover-elevate text-left">
              <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/35 text-cyber-cyan shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Real-Time Projects</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Work on live projects with actual users and feedback.
                </p>
              </div>
            </div>

            {/* Card 6: Global Network */}
            <div className="flex items-start gap-4 p-6 rounded-xl cyber-glass-purple hover-elevate-purple text-left">
              <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-cyber-purple/10 border border-cyber-purple/35 text-cyber-purple shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Global Network</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Connect with professionals and peers from around the world.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2.5 EVERYTHING YOU NEED TO SUCCEED */}
      <section id="succeed" className="py-20 border-b border-slate-900 bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto max-w-3xl text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
              Graduate with a market-ready product in hand, backed by experienced experts and a dedicated team. Transform from learner to entrepreneur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Build Your Product */}
            <div className="relative p-6 rounded-xl cyber-glass hover-elevate text-left flex flex-col justify-between min-h-[250px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/35 text-cyber-cyan shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-widest font-cyber">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Build Your Product</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Create a real, market-ready app or product during your training. Graduate with something you can showcase, sell, or launch.
                </p>
              </div>
              <div className="mt-4 pt-2">
                <a href="#apply" className="inline-flex items-center text-xs font-bold text-cyber-cyan hover:text-cyan-400 hover:gap-1.5 transition-all font-cyber">
                  Learn More <span className="ml-1">→</span>
                </a>
              </div>
            </div>

            {/* Card 2: AI-Powered Learning */}
            <div className="relative p-6 rounded-xl cyber-glass-purple hover-elevate-purple text-left flex flex-col justify-between min-h-[250px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyber-purple/10 border border-cyber-purple/35 text-cyber-purple shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                    <Brain className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI-Powered Learning</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Personalized learning paths powered by AI. Master cutting-edge technologies at your own pace with adaptive content.
                </p>
              </div>
              <div className="mt-4 pt-2">
                <a href="#apply" className="inline-flex items-center text-xs font-bold text-cyber-purple hover:text-purple-400 hover:gap-1.5 transition-all font-cyber">
                  Learn More <span className="ml-1">→</span>
                </a>
              </div>
            </div>

            {/* Card 3: Become an Entrepreneur */}
            <div className="relative p-6 rounded-xl cyber-glass hover-elevate text-left flex flex-col justify-between min-h-[250px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/35 text-cyber-cyan shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Become an Entrepreneur</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Learn to market your product, build your brand, and launch your business with guidance from successful founders.
                </p>
              </div>
              <div className="mt-4 pt-2">
                <a href="#apply" className="inline-flex items-center text-xs font-bold text-cyber-cyan hover:text-cyan-400 hover:gap-1.5 transition-all font-cyber">
                  Learn More <span className="ml-1">→</span>
                </a>
              </div>
            </div>

            {/* Card 4: Business Models */}
            <div className="relative p-6 rounded-xl cyber-glass-purple hover-elevate-purple text-left flex flex-col justify-between min-h-[250px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyber-purple/10 border border-cyber-purple/35 text-cyber-purple shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-widest font-cyber">
                    Visa Support
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Business Models</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Develop scalable startup ideas with Innovator Visa support. Turn your project into a thriving business.
                </p>
              </div>
              <div className="mt-4 pt-2">
                <a href="#apply" className="inline-flex items-center text-xs font-bold text-cyber-purple hover:text-purple-400 hover:gap-1.5 transition-all font-cyber">
                  Learn More <span className="ml-1">→</span>
                </a>
              </div>
            </div>

            {/* Card 5: Certifications */}
            <div className="relative p-6 rounded-xl cyber-glass hover-elevate text-left flex flex-col justify-between min-h-[250px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/35 text-cyber-cyan shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                    <Award className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Certifications</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Earn industry-recognized certificates. Validate your skills and demonstrate your expertise to clients and investors.
                </p>
              </div>
              <div className="mt-4 pt-2">
                <a href="#apply" className="inline-flex items-center text-xs font-bold text-cyber-cyan hover:text-cyan-400 hover:gap-1.5 transition-all font-cyber">
                  Learn More <span className="ml-1">→</span>
                </a>
              </div>
            </div>

            {/* Card 6: Expert Team Support */}
            <div className="relative p-6 rounded-xl cyber-glass-purple hover-elevate-purple text-left flex flex-col justify-between min-h-[250px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyber-purple/10 border border-cyber-purple/35 text-cyber-purple shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Expert Team Support</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Work alongside experienced professionals who guide you every step. Get mentorship from practitioners who have built successful products.
                </p>
              </div>
              <div className="mt-4 pt-2">
                <a href="#apply" className="inline-flex items-center text-xs font-bold text-cyber-purple hover:text-purple-400 hover:gap-1.5 transition-all font-cyber">
                  Learn More <span className="ml-1">→</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OUR PROGRAMS COURSE GRID */}
      <section id="technology" className="py-20 border-b border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-cyber-cyan uppercase font-cyber tracking-widest">
              Available Modules
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Explore Our Programs
            </h2>
            <p className="mx-auto max-w-xl text-slate-400 mt-3 text-sm">
              Acquire high-demand technical capabilities. Enroll to unlock direct project workspace slots and obtain verified certifications.
            </p>
          </div>

          {modulesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="h-80 rounded-xl border border-slate-900 bg-slate-950/50 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {modules.map((m) => {
                const isComing = m.status === 'Coming Soon';
                const levelColors = {
                  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
                  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/25",
                  Advanced: "bg-rose-500/10 text-rose-400 border-rose-500/25"
                };

                return (
                  <div
                    key={m.id}
                    className="relative flex flex-col justify-between p-6 rounded-xl cyber-glass hover-elevate"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${levelColors[m.level]}`}>
                          {m.level}
                        </span>
                        {m.duration && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-cyber">
                            <Clock className="h-3 w-3 text-cyber-cyan" />
                            {m.duration}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 text-left">{m.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed text-left mb-6">{m.description}</p>
                    </div>

                    <div className="border-t border-slate-900 pt-4 flex items-center justify-between gap-4 mt-6">
                      <Link href={`/modules/${m.id}`} className="text-xs font-semibold text-cyber-cyan hover:underline flex items-center gap-1">
                        Syllabus details <ChevronRight className="h-3 w-3" />
                      </Link>
                      
                      <button
                        onClick={() => handleEnrollClick(m.id, m.status)}
                        disabled={isComing}
                        className={`px-4 py-1.5 rounded text-xs font-bold font-cyber transition-all ${
                          isComing
                            ? "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
                            : "bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/25 hover:bg-cyber-cyan/30 active:scale-95"
                        }`}
                      >
                        {isComing ? "COMING SOON" : "ENROLL NOW"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 4. HOW IT WORKS CHRONOLOGICAL ROADMAP */}
      <section id="how-it-works" className="py-20 border-b border-slate-900 bg-slate-950/45">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-cyber-cyan uppercase font-cyber tracking-widest">
              The Journey
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white mt-2">
              How NovaCrystara Works
            </h2>
            <p className="mx-auto max-w-xl text-slate-400 mt-3 text-sm">
              Follow our simple, high-impact 4-step pipeline from applicant to verified enterprise creator.
            </p>
          </div>

          <div className="relative">
            {/* Horizontal Line behind for large viewports */}
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-slate-800 to-transparent -translate-y-1/2 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="text-center cyber-glass p-6 rounded-xl">
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-cyber-cyan/10 border border-cyber-cyan/35 text-cyber-cyan text-base font-bold font-cyber mb-4">
                  01
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">Apply & Resume</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Submit your details and upload your portfolio or resume. Secure a customized onboarding interview.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center cyber-glass p-6 rounded-xl">
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-cyber-purple/10 border border-cyber-purple/35 text-cyber-purple text-base font-bold font-cyber mb-4">
                  02
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">Choose Cohort</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Match with our specialized engineering tracks. Select your module and start interactive telemetry setups.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center cyber-glass p-6 rounded-xl">
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-cyber-cyan/10 border border-cyber-cyan/35 text-cyber-cyan text-base font-bold font-cyber mb-4">
                  03
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">Build Capstone</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Construct a high-performance active project. Validate edge cases with expert team leads.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center cyber-glass p-6 rounded-xl">
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-cyber-purple/10 border border-cyber-purple/35 text-cyber-purple text-base font-bold font-cyber mb-4">
                  04
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">Earn Certificate</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Perfect project progress milestones to 100%. Receive verified cryptographical certifications.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. HEAR FROM OUR ALUMNI TESTIMONIALS SLIDER */}
      <section id="testimonials" className="py-20 border-b border-slate-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-cyber-cyan uppercase font-cyber tracking-widest">
              Impact Stories
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Hear From Our Alumni
            </h2>
          </div>

          {/* Testimonial Active Display Card */}
          <div className="relative p-8 md:p-12 rounded-2xl cyber-glass overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-cyber-cyan/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-left">
              
              {/* Initials Avatar Grid */}
              <div className="h-16 w-16 md:h-20 md:w-20 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-tr from-cyber-cyan to-cyber-blue text-slate-900 font-bold text-xl md:text-2xl shadow-lg border border-cyan-300/35">
                {TESTIMONIALS[activeTestimonial].initials}
              </div>

              <div>
                <p className="text-lg md:text-xl font-medium text-slate-200 leading-relaxed italic mb-6">
                  "{TESTIMONIALS[activeTestimonial].quote}"
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white text-base">
                      {TESTIMONIALS[activeTestimonial].name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {TESTIMONIALS[activeTestimonial].role}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {TESTIMONIALS[activeTestimonial].skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyber-cyan">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Slider Dots */}
            <div className="flex items-center justify-center gap-3 mt-8">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeTestimonial === idx ? "w-8 bg-cyber-cyan shadow-[0_0_10px_#00f2fe]" : "w-2.5 bg-slate-800"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                ></button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 6. INTERACTIVE CTA REGISTRATION FORM */}
      <section id="apply" className="py-20 bg-slate-950/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          
          <div className="p-8 md:p-10 rounded-2xl cyber-glass relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -left-10 h-32 w-32 bg-cyber-cyan/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Submit Cohort Application
              </h2>
              <p className="text-xs text-slate-400 mt-2">
                Join our premium tech training accelerator and construct production-ready capstone networks.
              </p>
            </div>

            {isRegistered ? (
              /*
              <div className="py-8 text-center animate-fadeIn">
                <CheckCircle className="h-16 w-16 text-cyber-cyan mx-auto mb-4 drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]" />
                <h3 className="text-xl font-bold text-white mb-2">Application Confirmed!</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                  Thank you for applying. We have simulated your workspace setup. You are now logged in and pre-enrolled!
                </p>
                <Link href="/dashboard">
                  <button className="px-6 py-2.5 rounded-md text-sm font-bold font-cyber text-slate-900 bg-gradient-to-r from-cyber-cyan to-cyber-blue shadow-lg active:scale-95 transition-all">
                    GO TO DASHBOARD
                  </button>
                </Link>
              </div>
              */
              <div className="py-8 text-center animate-fadeIn">
                <CheckCircle className="h-16 w-16 text-cyber-cyan mx-auto mb-4 drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]" />
                <h3 className="text-xl font-bold text-white mb-2">Application Confirmed!</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                  Thank you for submitting your cohort application! We have successfully received your registration details and dossier. Our team will review your application and reach out to you shortly.
                </p>
                <button
                  onClick={() => {
                    setFullName('');
                    setEmail('');
                    setSelectedModule('ai-agents');
                    setResumeFile(null);
                    setUploadedUrl('');
                    setIsRegistered(false);
                  }}
                  className="px-6 py-2.5 rounded-md text-sm font-bold font-cyber text-slate-900 bg-gradient-to-r from-cyber-cyan to-cyber-blue shadow-lg active:scale-95 transition-all mt-4"
                >
                  REGISTER FOR ANOTHER ENTRY
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-6 text-left">
                
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your first and last name"
                    className="w-full px-4 py-3 rounded-lg text-sm text-slate-200 bg-slate-950/80 border border-slate-800 focus:border-cyber-cyan focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-lg text-sm text-slate-200 bg-slate-950/80 border border-slate-800 focus:border-cyber-cyan focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="program" className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
                    Select Tech Program
                  </label>
                  <select
                    id="program"
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm text-slate-200 bg-slate-950/80 border border-slate-800 focus:border-cyber-cyan focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-colors"
                  >
                    <option value="ai-agents">AI Agents (Advanced - 12 Weeks)</option>
                    <option value="iot">IoT (Intermediate - 10 Weeks)</option>
                    <option value="data-engineering">Data Engineering (Intermediate - 8 Weeks)</option>
                    <option value="project-management">Project Management (Beginner - 6 Weeks)</option>
                    <option value="scrum-master">Scrum Master (Beginner - 6 Weeks)</option>
                  </select>
                </div>

                {/* Upload Section (interacts with /api/objects/upload) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
                    Upload CV / Portfolio (Optional)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-800 rounded-lg p-6 text-center cursor-pointer hover:border-cyber-cyan hover:bg-cyber-cyan/5 transition-all group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />

                    {isUploading ? (
                      <div className="space-y-2">
                        <Clock className="h-8 w-8 text-cyber-cyan animate-spin mx-auto" />
                        <p className="text-xs text-slate-400">Uploading your dossier to secure storage...</p>
                      </div>
                    ) : resumeFile ? (
                      <div className="space-y-2">
                        <FileText className="h-8 w-8 text-cyber-cyan mx-auto drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]" />
                        <p className="text-sm font-semibold text-slate-200">{resumeFile.name}</p>
                        <p className="text-[10px] text-slate-500">File attached successfully</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 text-slate-500 group-hover:text-cyber-cyan transition-colors mx-auto" />
                        <p className="text-sm font-semibold text-slate-300">Click to upload dossier</p>
                        <p className="text-[10px] text-slate-500">PDF, DOC, DOCX up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-sm font-bold font-cyber text-slate-900 bg-gradient-to-r from-cyber-cyan to-cyber-blue shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  SUBMIT CONFIRM APPLICATION
                </button>

              </form>
            )}

          </div>

        </div>
      </section>

    </div>
  );
}

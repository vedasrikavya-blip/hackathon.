import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  BookOpen, 
  Palette, 
  Video, 
  FileQuestion, 
  BarChart2, 
  Target, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  Network, 
  GitBranch, 
  Cpu, 
  Layers, 
  Award, 
  Mail, 
  Loader2, 
  Check,
  Terminal,
  Paperclip,
  Activity,
  ArrowLeft,
  RefreshCw,
  Send,
  HelpCircle,
  X,
  Sliders,
  LineChart,
  ThumbsUp,
  Key
} from 'lucide-react';

import CursorGrid from './components/CursorGrid';
import GhostCursor from './components/GhostCursor';
import SplitText from './components/SplitText';
import AppleButton from './components/AppleButton';
import { LogoMark } from './components/Icons';
import { generatePathway, type PathwayData } from './components/LearningEngine';
import { AIVisualization } from './components/AIVisualization';
import { WorkspaceMockup } from './components/WorkspaceMockup';

export default function App() {
  // Navigation & View State
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  
  // Landing State
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [yearlyPricing, setYearlyPricing] = useState(false);
  const [selectedAgentTab, setSelectedAgentTab] = useState(0);

  // App / Workspace State
  const [goalPrompt, setGoalPrompt] = useState('Explain quantum computing superposition using analogies and create a 5-question quiz.');
  const [currentPathway, setCurrentPathway] = useState<PathwayData | null>(null);
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  
  // API Config State
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '');
  const [apiError, setApiError] = useState<string | null>(null);

  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizChecked, setQuizChecked] = useState<Record<number, boolean>>({});

  // Active difficulty state
  const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  // Agent detail modal state
  const [activeAgentModal, setActiveAgentModal] = useState<string | null>(null);

  // Sync API Key to localStorage
  useEffect(() => {
    localStorage.setItem('gemini_api_key', geminiApiKey);
  }, [geminiApiKey]);

  // Initialize pathway on first view change
  useEffect(() => {
    if (!currentPathway && view === 'app') {
      triggerPathwayGeneration(goalPrompt, difficultyLevel);
    }
  }, [view]);

  // Function to call Gemini Live LLM
  const fetchLivePathway = async (apiKey: string, promptText: string, level: string): Promise<PathwayData> => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    
    const systemPrompt = `You are the IDEA Multi-Agent Orchestrator. The user wants to learn about: "${promptText}" at level: "${level}".
    Create a complete structured curriculum. Return a JSON response adhering to the exact typescript schema. Do not wrap in markdown tags or \`\`\`json blocks.
    Your diagramType must be one of: 'quantum' | 'photosynthesis' | 'blockchain' | 'blackhole' | 'generic'. Select whichever represents the topic best.
    If 'generic', provide 4 concept labels in diagramLabels. Otherwise, leave diagramLabels as an empty array.
    Ensure there are exactly 2-3 modules, 4 flowchart steps matching the agent assignments, and 2-3 quiz questions.`;

    const schemaPrompt = `Schema:
    {
      "title": "Title with level description",
      "category": "Broad Category name",
      "summary": "2 sentence summary",
      "diagramType": "quantum" | "photosynthesis" | "blockchain" | "blackhole" | "generic",
      "diagramLabels": string[],
      "modules": [{ "title": string, "content": string, "analogy": string, "attachment": string }],
      "flowchart": [{ "step": string, "agent": "Curriculum Agent" | "Research Agent" | "Visual Design Agent" | "Storytelling Agent" | "Quiz Agent", "desc": string }],
      "quiz": [{ "question": string, "options": string[], "answerIndex": number, "explanation": string }]
    }`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${schemaPrompt}` }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) {
      throw new Error('Empty response from AI model');
    }

    return JSON.parse(resultText) as PathwayData;
  };

  // Handle pathway generation triggers
  const triggerPathwayGeneration = async (promptText: string, level: 'beginner' | 'intermediate' | 'advanced') => {
    setIsGenerating(true);
    setGenerationStep(1);
    setQuizAnswers({});
    setQuizChecked({});
    setSelectedModuleIdx(0);
    setApiError(null);

    // If API Key is present, call the live Gemini LLM
    if (geminiApiKey.trim()) {
      try {
        // Step 1: Parsing
        setGenerationStep(1);
        await new Promise(r => setTimeout(r, 800));

        // Step 2: Curriculum
        setGenerationStep(2);
        await new Promise(r => setTimeout(r, 800));

        // Step 3: Research
        setGenerationStep(3);
        const liveData = await fetchLivePathway(geminiApiKey.trim(), promptText, level);

        // Step 4: Storytelling / Visual / Quiz compile
        setGenerationStep(4);
        await new Promise(r => setTimeout(r, 800));

        setCurrentPathway(liveData);
        setIsGenerating(false);
      } catch (err: any) {
        console.error(err);
        let friendlyMsg = 'Failed to fetch live pathway. Falling back to local synthesis...';
        const errMsg = String(err.message || err);
        if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('key not valid') || errMsg.includes('INVALID_ARGUMENT')) {
          friendlyMsg = 'Invalid Gemini API Key. Please configure a valid key in the left sidebar. Falling back to offline synthesis...';
        } else {
          friendlyMsg = `API Error: ${errMsg.slice(0, 80)}... Falling back to local synthesis...`;
        }
        setApiError(friendlyMsg);
        // Fallback to local offline engine if live fails
        setTimeout(() => {
          setCurrentPathway(generatePathway(promptText, level));
          setIsGenerating(false);
        }, 2000);
      }
    } else {
      // Offline fallback sequence
      const interval = setInterval(() => {
        setGenerationStep(prev => {
          if (prev >= 4) {
            clearInterval(interval);
            setCurrentPathway(generatePathway(promptText, level));
            setIsGenerating(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1200);
    }
  };

  // Trigger regeneration when difficulty changes
  const handleDifficultyChange = (newLevel: 'beginner' | 'intermediate' | 'advanced') => {
    setDifficultyLevel(newLevel);
    triggerPathwayGeneration(goalPrompt, newLevel);
  };

  // Agent Click Handler for detail modal triggers
  const handleAgentNodeClick = (agentName: string) => {
    setActiveAgentModal(agentName);
  };

  // Email Waitlist Handler
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) {
      setWaitlistStatus('error');
      return;
    }
    setWaitlistStatus('loading');
    setTimeout(() => {
      setWaitlistStatus('success');
      setWaitlistEmail('');
    }, 1200);
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'AI Agents', href: '#agents' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Demo', href: '#demo' },
    { label: 'Team', href: '#team' },
    { label: 'Contact', href: '#contact' }
  ];

  const agentCards = [
    {
      name: 'Curriculum Agent',
      icon: Brain,
      color: '#00F5FF',
      role: 'Syllabus & Pathway Architect',
      desc: 'Orchestrates the entire educational layout. Maps broad subject requests into bite-sized, logically progressive modules tailored to learner timelines and cognitive targets.',
      details: ['Modular sequencing', 'Difficulty tuning', 'Bloom\'s taxonomy alignment']
    },
    {
      name: 'Research Agent',
      icon: BookOpen,
      color: '#7B61FF',
      role: 'Content Sourcing & Fact-Checker',
      desc: 'Retrieves academic literature, cross-references statements with peer-reviewed databases, and verifies the absolute scientific precision of every fact included in the curriculum.',
      details: ['Semantic source ingestion', 'Disinformation scrubbing', 'Reference mapping']
    },
    {
      name: 'Visual Design Agent',
      icon: Palette,
      color: '#6EE7FF',
      role: 'Diagram & Animation Generator',
      desc: 'Translates complex theories into vector schematics, 3D model mockups, and interactive Bloch sphere widget representations to facilitate spatial and visual understanding.',
      details: [' Bloch sphere synthesis', 'Responsive SVG rendering', 'Adaptive chart creation']
    },
    {
      name: 'Storytelling Agent',
      icon: Video,
      color: '#FF007F',
      role: 'Analogy & Scriptwriter',
      desc: 'Finds intuitive, memorable analogies to explain dense topics (e.g. comparing quantum superposition to a spinning coin). Crafts engaging lesson scripts and dialogues.',
      details: ['Socratic narrative structure', 'Interactive cues', 'Humor & engagement loops']
    },
    {
      name: 'Quiz Agent',
      icon: FileQuestion,
      color: '#FFD700',
      role: 'Adaptive Assessment Engine',
      desc: 'Generates customized, non-searchable diagnostic items that test conceptual understanding rather than rote memorization. Varies question difficulty in real-time.',
      details: ['Conceptual item models', 'Distractor feedback generation', 'Adaptive grading scaling']
    },
    {
      name: 'Analytics Agent',
      icon: BarChart2,
      color: '#00FF7F',
      role: 'Learner Telemetry Grapher',
      desc: 'Monitors student navigation paths, response delays, and self-assessment scores to continually fine-tune the study flow and detect conceptual roadblocks instantly.',
      details: ['Dwell-time coefficient profiling', 'Skill hierarchy projection', 'Retention predictions']
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050816] text-white">
      {/* -------------------- VIEW 1: LANDING PAGE -------------------- */}
      {view === 'landing' && (
        <>
          {/* Global Background Video */}
          <div className="fixed inset-0 z-0 pointer-events-none select-none">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover pointer-events-none opacity-20"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" 
            />
          </div>

          {/* Canvas Particles Background */}
          <GhostCursor />

          {/* Fixed Vertical Guide Lines */}
          <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
          <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

          {/* Navbar */}
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="sticky top-0 w-full z-50 border-b border-white/10 bg-black/40 backdrop-blur-md"
          >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <a href="#home" className="flex items-center gap-2 group">
                <LogoMark className="w-8 h-8 text-white group-hover:text-accentCyan transition-colors" />
                <span className="font-bold text-lg tracking-wider font-mono">IDEA</span>
              </a>

              {/* Center Links */}
              <div className="hidden md:flex gap-8">
                {navLinks.map((link, idx) => (
                  <motion.a 
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                    className="text-white/70 text-sm font-medium hover:text-white transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-accentCyan transition-all group-hover:w-full" />
                  </motion.a>
                ))}
              </div>

              {/* Right Desktop CTA */}
              <div className="hidden md:flex gap-4 items-center">
                <button 
                  onClick={() => setIsDemoModalOpen(true)}
                  className="text-white/70 hover:text-white text-sm font-semibold transition-colors"
                >
                  Watch Demo
                </button>
                <AppleButton label="Launch Platform" onClick={() => setView('app')} />
              </div>

              {/* Mobile Menu Icon Button */}
              <button 
                onClick={() => setView('app')}
                className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </motion.nav>

          {/* Hero Section */}
          <section id="home" className="relative pt-16 md:pt-28 pb-20 text-center flex flex-col items-center overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
              <CursorGrid
                cellSize={70}
                color="#00F5FF"
                radius={150}
                falloff="smooth"
                holdTime={300}
                fadeDuration={600}
                lineWidth={1.0}
                maxOpacity={0.8}
                fillOpacity={0.03}
                gridOpacity={0.04}
                cellRadius={8}
                clickPulse
                pulseSpeed={700}
              />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7 text-left space-y-8 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 w-fit">
                  <span className="w-2 h-2 rounded-full bg-accentCyan animate-pulse" />
                  <span className="text-xs font-semibold tracking-wide text-white/80">Multi-Agent AI Platform for Personalized Learning</span>
                </div>

                <h1 className="text-4xl md:text-[5.5rem] font-semibold tracking-tight leading-[0.9] flex flex-col">
                  <SplitText text="The Future of" className="text-white" delay={0.1} />
                  <span className="mt-1 flex flex-wrap items-center">
                    <SplitText text="Personalized" className="text-white mr-4" delay={0.3} />
                    <span 
                      style={{
                        backgroundImage: 'linear-gradient(to right, #00F5FF 0%, #7B61FF 50%, #00F5FF 100%)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        WebkitTextFillColor: 'transparent',
                        filter: 'url(#c3-noise)'
                      }}
                      className="animate-shiny font-bold"
                    >
                      Learning
                    </span>
                  </span>
                  <SplitText text="Starts Here." className="text-white mt-1" delay={0.5} />
                </h1>

                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-accentLightCyan font-medium text-lg md:text-xl font-mono"
                >
                  One Prompt. Infinite AI Agents. Unlimited Learning.
                </motion.p>

                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="text-white/60 max-w-xl text-sm md:text-base leading-relaxed"
                >
                  IDEA is an autonomous Multi-Agent AI platform that dynamically creates specialized AI agents to design personalized educational experiences from a single prompt. 
                  <br /><br />
                  Curriculum planning, research, assessment generation, storytelling, visual learning, quizzes, adaptive pathways and learner analytics—all orchestrated intelligently by AI.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="flex flex-wrap gap-4 items-center"
                >
                  <button 
                    onClick={() => setView('app')}
                    className="px-6 py-3.5 rounded-full bg-gradient-to-r from-accentCyan to-accentPurple text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all active:scale-95 text-center flex items-center gap-2"
                  >
                    <span>Launch Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsDemoModalOpen(true)}
                    className="px-6 py-3.5 rounded-full border border-white/10 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all text-center"
                  >
                    Watch Demo
                  </button>
                </motion.div>

                {/* Floating Stats */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10"
                >
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-accentCyan font-mono">12+</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Specialized AI Agents</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-accentPurple font-mono">100%</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Adaptive Learning</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-accentLightCyan font-mono">60%</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Faster Content Creation</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-white font-mono">Real-time</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Collaboration</div>
                  </div>
                </motion.div>
              </div>

              {/* Right Orbit Visualization */}
              <div className="md:col-span-5 flex justify-center items-center">
                <AIVisualization />
              </div>
            </div>
          </section>

          {/* macOS Menu bar strip */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="w-full bg-black/40 backdrop-blur-md border-t border-b border-white/10"
          >
            <div className="max-w-6xl mx-auto px-6 h-10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4 text-white/60">
                <LogoMark className="w-3.5 h-3.5 text-white" />
                <span className="font-bold text-white">IDEA Console</span>
                {['File', 'Edit', 'Agent', 'Graph', 'Window', 'Help'].map((item, idx) => (
                  <span 
                    key={item} 
                    className={`hover:text-white cursor-pointer ${
                      idx > 2 ? 'hidden sm:inline' : 'inline'
                    } ${idx > 4 ? 'hidden md:inline' : 'inline'}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-white/40">
                <div className="flex items-center gap-1.5">
                  <Search className="w-3 h-3" />
                  <span>Search Logs</span>
                </div>
                <span>Fri Jul 17 5:43 PM</span>
              </div>
            </div>
          </motion.section>

          {/* Interactive Workspace Mockup Container */}
          <section id="demo" className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="text-center space-y-4 mb-10">
              <div className="inline-flex items-center gap-1.5 text-xs text-accentCyan font-semibold font-mono bg-accentCyan/10 border border-accentCyan/20 px-3 py-1 rounded-full uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>Console Demonstration</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">
                Experience the Multi-Agent Workspace
              </h2>
              <p className="text-sm text-white/50 max-w-lg mx-auto">
                Below is a mock overview of the console. Click **"Launch Platform"** above to open the fully functional workspace where you can enter custom questions!
              </p>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pointer-events-none opacity-80">
                <WorkspaceMockup />
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setView('app')}
                  className="px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Open Interactive App Console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </section>

          {/* Features Column Grid */}
          <section id="features" className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="space-y-6 text-left"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-accentCyan" />
                  <span className="text-white/60">Triage Engine</span>
                  <span className="text-white/30">|</span>
                  <span className="text-accentCyan font-mono">AI-Native</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
                  Why IDEA?<br />
                  <span className="text-accentCyan font-bold">Autonomous learning</span> at scale.
                </h2>

                <p className="text-white/60 text-base leading-relaxed">
                  IDEA is built to eliminate the tedious hours instruction designers and teachers spend organizing material. It parses any prompt, maps out a complete structural syllabus, fetches relevant research, generates custom visuals, and designs adaptive quizzes in seconds.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    'Dynamic Agent Creation',
                    'Adaptive Learning',
                    'Real-Time Collaboration',
                    'AI Personalization',
                    'Knowledge Graph',
                    'Assessment Intelligence'
                  ].map(chip => (
                    <span 
                      key={chip} 
                      className="text-xs text-white/80 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] shadow-inner font-medium hover:border-accentCyan/30 hover:bg-accentCyan/5 transition-colors"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </motion.div>

              <div className="space-y-4">
                <div className="liquid-glass rounded-2xl p-6 text-left space-y-4 border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs text-white/50 font-mono">Real-Time Core Metrics</span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded">
                      System Online
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="liquid-glass rounded-xl p-4 border border-white/5 flex items-center justify-between hover:border-accentCyan/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-accentCyan/10 text-accentCyan">
                          <Brain className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold">Dynamic Agent Synthesis</h4>
                          <p className="text-[10px] text-white/40">Spawns child agents for targeted tasks on the fly.</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-accentCyan font-bold">Instantiated</span>
                    </div>

                    <div className="liquid-glass rounded-xl p-4 border border-white/5 flex items-center justify-between hover:border-accentPurple/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-accentPurple/10 text-accentPurple">
                          <Target className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold">100% Adaptive Learning Pathways</h4>
                          <p className="text-[10px] text-white/40">Calibrates difficulty curves on student telemetry.</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-accentPurple font-bold">1:1 Fit</span>
                    </div>

                    <div className="liquid-glass rounded-xl p-4 border border-white/5 flex items-center justify-between hover:border-accentLightCyan/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-accentLightCyan/10 text-accentLightCyan">
                          <Network className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold">Consensus Knowledge Graphs</h4>
                          <p className="text-[10px] text-white/40">Links cross-disciplinary nodes for deep contexts.</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-accentLightCyan font-bold">Validated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Logo Cloud */}
          <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 border-t border-white/10">
            <div className="text-center space-y-10">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold font-mono">
                Trusted by the world's most thoughtful educational teams
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 justify-center items-center">
                {['MIT', 'Stanford', 'Harvard', 'UC Berkeley', 'Khan Academy', 'Duolingo', 'Coursera', 'Udemy'].map((name, idx) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    className="text-sm font-bold tracking-tight text-white/50 hover:text-white cursor-pointer select-none py-2 px-3 border border-white/5 hover:border-white/15 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-all text-center"
                  >
                    {name}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Meet the AI Agents Tabs */}
          <section id="agents" className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-1.5 text-xs text-accentPurple font-semibold font-mono bg-accentPurple/10 border border-accentPurple/20 px-3 py-1 rounded-full uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                <span>Meet the AI Agents</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
                Specialized Cognitive Workers
              </h2>
              <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base">
                IDEA dynamically deploys cooperative AI nodes that each command a distinct skill sector in pedagogical creation.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-4 flex flex-col gap-2">
                {agentCards.map((agent, index) => {
                  const Icon = agent.icon;
                  const isActive = selectedAgentTab === index;
                  return (
                    <div
                      key={agent.name}
                      onClick={() => setSelectedAgentTab(index)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        isActive 
                          ? 'bg-white/10 border-accentCyan/30 text-white shadow-xl translate-x-1' 
                          : 'bg-white/[0.01] border-white/5 text-white/60 hover:bg-white/[0.03] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ 
                            backgroundColor: isActive ? `${agent.color}15` : 'rgba(255,255,255,0.03)',
                            color: agent.color 
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold font-mono">{agent.name}</h4>
                          <p className="text-[10px] text-white/40 truncate w-48">{agent.role}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-accentCyan' : 'text-white/30'}`} />
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-8">
                {agentCards.map((agent, index) => {
                  const Icon = agent.icon;
                  if (selectedAgentTab !== index) return null;
                  return (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="liquid-glass rounded-2xl border border-white/10 p-8 h-full flex flex-col justify-between text-left relative overflow-hidden"
                    >
                      <div 
                        className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full blur-[60px] opacity-25 pointer-events-none"
                        style={{ backgroundColor: agent.color }}
                      />

                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div 
                            className="p-3.5 rounded-xl border"
                            style={{ 
                              backgroundColor: `${agent.color}10`, 
                              borderColor: `${agent.color}30`,
                              color: agent.color 
                            }}
                          >
                            <Icon className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold font-mono text-white">{agent.name}</h3>
                            <p className="text-xs font-semibold font-mono" style={{ color: agent.color }}>
                              {agent.role}
                            </p>
                          </div>
                        </div>

                        <p className="text-white/70 text-sm md:text-base leading-relaxed">
                          {agent.desc}
                        </p>

                        <div className="space-y-2 pt-2">
                          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">Core Subtasks & Graph Responsibilities</h4>
                          <div className="grid md:grid-cols-3 gap-3">
                            {agent.details.map((detail, idx) => (
                              <div key={idx} className="p-3 rounded-lg border border-white/5 bg-white/[0.01] flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: agent.color }} />
                                <span className="text-xs text-white/80 font-medium">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] text-white/40 font-mono">Agent Status: Active & Synced</span>
                        <button 
                          onClick={() => setView('app')}
                          className="text-xs font-bold text-accentCyan hover:text-white flex items-center gap-1.5 transition-colors"
                        >
                          <span>Simulate in Console</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Workflow & Flow Diagrams */}
          <section id="workflow" className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-1.5 text-xs text-accentCyan font-semibold font-mono bg-accentCyan/10 border border-accentCyan/20 px-3 py-1 rounded-full uppercase tracking-wider">
                <GitBranch className="w-3.5 h-3.5" />
                <span>Agent Orchestration Graph</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
                How It Works & Graph Architecture
              </h2>
              <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base">
                From prompt parsing to learning delivery, follow the flow of active agents.
              </p>
            </div>

            <div className="hidden lg:flex justify-between items-center relative py-6 select-none">
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-accentCyan via-accentPurple to-emerald-400 opacity-20 z-0" />
              {[
                { label: 'Prompt Input', desc: 'Single Text Prompt' },
                { label: 'Planner Agent', desc: 'Syllabus Mapping' },
                { label: 'Generator Node', desc: 'Agent Instantiation' },
                { label: 'Research Agent', desc: 'Scholarly Verification' },
                { label: 'Design & Scripting', desc: 'Analogies & Visuals' },
                { label: 'Quiz & Telemetry', desc: 'Adaptive Testing' },
                { label: 'Reviewer Agent', desc: 'Quality Check' },
                { label: 'Delivery Module', desc: 'Interactive Lesson' }
              ].map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center max-w-[120px] text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#050816] border border-white/10 flex items-center justify-center font-bold font-mono text-xs shadow-lg hover:border-accentCyan/50 transition-colors cursor-pointer">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono tracking-tight">{step.label}</h4>
                    <p className="text-[9px] text-white/40 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Architecture diagram mapping grid */}
            <div id="architecture" className="mt-20 border border-white/10 bg-black/30 rounded-2xl p-6 md:p-8 space-y-6 text-left">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <Layers className="w-4 h-4 text-accentCyan" />
                <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-white">IDEA Engine Architecture Map</h3>
              </div>

              <div className="grid md:grid-cols-4 gap-4 text-xs font-mono text-center">
                <div className="p-4 rounded bg-white/5 border border-white/10 hover:border-accentCyan/30 transition-all flex flex-col justify-center min-h-[80px]">
                  <span className="text-[9px] text-white/40 block mb-1">Layer 1: Input</span>
                  <span className="font-bold">Prompt Capture</span>
                </div>
                <div className="p-4 rounded bg-white/5 border border-white/10 hover:border-accentCyan/30 transition-all flex flex-col justify-center min-h-[80px]">
                  <span className="text-[9px] text-white/40 block mb-1">Layer 2: Parser</span>
                  <span className="font-bold">Planner Agent</span>
                </div>
                <div className="p-4 rounded bg-white/5 border border-white/10 hover:border-accentCyan/30 transition-all flex flex-col justify-center min-h-[80px]">
                  <span className="text-[9px] text-white/40 block mb-1">Layer 3: Tasking</span>
                  <span className="font-bold">Task Dependency Graph</span>
                </div>
                <div className="p-4 rounded bg-[#00F5FF]/10 border border-[#00F5FF]/30 transition-all flex flex-col justify-center min-h-[80px]">
                  <span className="text-[9px] text-accentCyan block mb-1">Layer 4: Orchestrator</span>
                  <span className="font-bold text-accentCyan">Agent Orchestrator</span>
                </div>
              </div>
            </div>
          </section>

          {/* Why This Matters value-prop grid */}
          <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Value Proposition</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
                Why This Matters
              </h2>
              <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base">
                IDEA represents a paradigm shift in educational layout and design workflow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 text-left">
              {[
                { title: 'Reduces Educator Workload', desc: 'Automates lesson planning, visual assets, and assessments, saving hours of manual prep time.' },
                { title: 'Generates Personalized Learning', desc: 'Crafts custom-paced pathways aligned with individual target goals and speed capabilities.' },
                { title: 'Supports Multiple Learning Styles', desc: 'Generates narratives, code snippets, visual graphics, and adaptive interactive widgets.' },
                { title: 'Creates Engaging Content Automatically', desc: 'Synthesizes Socratic scripts, quizzes, and relatable analogies from a single plain prompt.' },
                { title: 'Scales Education Globally', desc: 'Provides enterprise-grade curriculum design tools to any tutor, teacher, or university.' }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="liquid-glass rounded-2xl p-5 border border-white/10 hover:border-accentCyan/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </div>
                    <h4 className="text-sm font-semibold text-white tracking-tight leading-snug">{item.title}</h4>
                    <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Plans Section */}
          <section className="c3-pricing-section border-t border-white/10">
            <div className="c3-watermark-container">
              <div className="c3-watermark-main">
                <span className="c3-watermark-line-1">Your learning.</span>
                <span className="c3-watermark-line-2 font-bold animate-shiny">Revitalized</span>
              </div>
            </div>

            <div className="c3-toggle-wrap">
              <span className="text-xs font-mono text-white/60">Bill Monthly</span>
              <button 
                onClick={() => setYearlyPricing(!yearlyPricing)}
                className={`c3-toggle ${yearlyPricing ? 'active' : ''}`}
                aria-label="Toggle pricing period"
              >
                <div className="c3-toggle-knob" />
              </button>
              <span className="text-xs font-mono text-accentCyan font-bold">Bill Yearly (Save 20%)</span>
            </div>

            <div className="c3-grid text-left">
              <div className="c3-card">
                <span className="c3-tier-small">Free Plan</span>
                <div className="c3-tier-large font-mono">$0<span className="text-xs text-white/40 font-normal">/mo</span></div>
                <p className="c3-desc">For student developers and educators taking their first steps with IDEA dynamic agents.</p>
                <ul className="c3-list">
                  <li><span className="c3-check"><Check className="w-3.5 h-3.5 text-white" /></span><span>Up to 3 pathways in the cloud</span></li>
                  <li><span className="c3-check"><Check className="w-3.5 h-3.5 text-white" /></span><span>Standard visual diagram export</span></li>
                  <li><span className="c3-check"><Check className="w-3.5 h-3.5 text-white" /></span><span>Basic agent tools</span></li>
                </ul>
                <button className="c3-btn" onClick={() => setView('app')}>Choose Free</button>
              </div>

              <div className="c3-card">
                <span className="c3-tier-small">Educator Plan</span>
                <div className="c3-tier-large font-mono">{yearlyPricing ? '$99.99' : '$9.99'}<span className="text-xs text-white/40 font-normal">{yearlyPricing ? '/y' : '/m'}</span></div>
                <p className="c3-desc">For freelancers, instructors, and small teams who need absolute conceptual customization.</p>
                <ul className="c3-list">
                  <li><span className="c3-check"><Check className="w-3.5 h-3.5 text-white" /></span><span>Up to 50 pathways in the cloud</span></li>
                  <li><span className="c3-check"><Check className="w-3.5 h-3.5 text-white" /></span><span>High-resolution visual diagram exports</span></li>
                  <li><span className="c3-check"><Check className="w-3.5 h-3.5 text-white" /></span><span>Advanced agent prompt editing toolkits</span></li>
                </ul>
                <button className="c3-btn" onClick={() => setView('app')}>Choose Educator</button>
              </div>

              <div className="c3-card c3-card-pro">
                <div className="absolute top-4 right-4 bg-accentPurple/20 text-accentPurple border border-accentPurple/30 text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Most Popular</div>
                <span className="c3-tier-small">Institution Plan</span>
                <div className="c3-tier-large font-mono">{yearlyPricing ? '$199.99' : '$19.99'}<span className="text-xs text-white/40 font-normal">{yearlyPricing ? '/y' : '/m'}</span></div>
                <p className="c3-desc">For schools, agencies, and professional departments requiring enterprise-grade scale.</p>
                <ul className="c3-list">
                  <li><span className="c3-check"><Check className="w-3.5 h-3.5 text-white" /></span><span>Unlimited pathways & study goals</span></li>
                  <li><span className="c3-check"><Check className="w-3.5 h-3.5 text-white" /></span><span>AI-powered assessment generation API</span></li>
                  <li><span className="c3-check"><Check className="w-3.5 h-3.5 text-white" /></span><span>Custom brand domain white-labeling</span></li>
                </ul>
                <button className="c3-btn" onClick={() => setView('app')}>Choose Institution</button>
              </div>
            </div>
          </section>

          {/* Waitlist Section */}
          <section id="waitlist" className="max-w-6xl mx-auto px-6 py-20 md:py-32 border-t border-white/10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center border border-white/10"
            >
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)' }} />
              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 text-xs text-accentCyan font-semibold font-mono bg-accentCyan/10 border border-accentCyan/20 px-3 py-1 rounded-full uppercase tracking-wider">
                    <Mail className="w-3.5 h-3.5 text-accentCyan" />
                    <span>Early Access Waitlist</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.02]">
                    Join the Future of<br /><span className="text-accentCyan font-bold">AI Education</span>
                  </h2>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md mx-auto">
                    Be among the first educators, instructional designers, researchers, and students to experience IDEA. Get early access updates and beta invitations.
                  </p>
                </div>

                <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto space-y-4">
                  <div className="relative flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="email"
                        value={waitlistEmail}
                        onChange={(e) => {
                          setWaitlistEmail(e.target.value);
                          if (waitlistStatus === 'error') setWaitlistStatus('idle');
                        }}
                        placeholder="Enter your email address"
                        disabled={waitlistStatus === 'loading' || waitlistStatus === 'success'}
                        className={`w-full bg-white/5 border rounded-full py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/30 focus:outline-none transition-all ${
                          waitlistStatus === 'error'
                            ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                            : 'border-white/10 focus:border-accentCyan focus:shadow-[0_0_15px_rgba(0,245,255,0.25)]'
                        }`}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={waitlistStatus === 'loading' || waitlistStatus === 'success'}
                      className="rounded-full bg-white text-black text-sm font-semibold px-6 py-3.5 transition-all hover:bg-white/90 active:scale-95 flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] disabled:opacity-50 flex-shrink-0"
                    >
                      {waitlistStatus === 'loading' ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>Requesting...</span></>
                      ) : (
                        <span>Request Early Access</span>
                      )}
                    </button>
                  </div>

                  {waitlistStatus === 'success' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                      🎉 You're on the waitlist! We'll notify you when IDEA launches.
                    </motion.div>
                  )}

                  {waitlistStatus === 'error' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                      Please enter a valid email address.
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="w-full bg-[#03050e] border-t border-white/5 py-12">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <LogoMark className="w-7 h-7 text-white" />
                <span className="font-bold text-base tracking-wider font-mono">IDEA</span>
              </div>
              <p className="text-white/40 text-xs max-w-sm">
                Building the Future of AI-Powered Personalized Learning. Created for the Premium Hackathon Release.
              </p>
              <div className="flex gap-6 text-xs text-white/50">
                <a href="https://github.com" className="hover:text-white transition-colors">GitHub</a>
                <a href="#demo" className="hover:text-white transition-colors">Demo</a>
                <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* -------------------- VIEW 2: INTERACTIVE CONSOLE SUB-PAGE (SCROLLABLE SINGLE PAGE) -------------------- */}
      {view === 'app' && (
        <div className="relative min-h-screen flex flex-col bg-[#050816] select-none overflow-hidden h-screen">
          {/* Background Fullscreen CursorGrid (electric purple-blue) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <CursorGrid
              cellSize={70}
              color="#7B61FF"
              radius={145}
              falloff="smooth"
              holdTime={400}
              fadeDuration={850}
              lineWidth={1.2}
              maxOpacity={1.0}
              fillOpacity={0.02}
              gridOpacity={0.04}
              cellRadius={6}
              clickPulse
              pulseSpeed={650}
            />
          </div>

          {/* Console Header */}
          <header className="relative z-10 h-16 border-b border-white/10 bg-black/40 backdrop-blur-md px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView('landing')}
                className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors hover:border-white/20 active:scale-95"
                title="Return to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <LogoMark className="w-7 h-7 text-accentCyan" />
                <span className="font-bold text-sm tracking-wider font-mono uppercase">IDEA Console</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Difficulty/Personalization Selector */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 text-[11px] font-mono">
                <span className="text-white/40 px-2.5 uppercase font-bold text-[9px] tracking-wider">Level:</span>
                {(['beginner', 'intermediate', 'advanced'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => handleDifficultyChange(lvl)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                      difficultyLevel === lvl
                        ? 'bg-gradient-to-r from-accentCyan to-accentPurple text-white shadow-md'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-white/70 font-mono text-[10px]">Agents: Online</span>
              </div>
              <button 
                onClick={() => triggerPathwayGeneration(goalPrompt, difficultyLevel)}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-accentCyan/30 transition-all"
                title="Reset Pipeline"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Core Workspace Panels */}
          <main className="relative z-10 flex-1 grid grid-cols-12 overflow-hidden h-[calc(100vh-64px)]">
            
            {/* 1. Sidebar (col-span-3) */}
            <div className="col-span-12 lg:col-span-3 border-r border-white/10 bg-black/20 p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                
                {/* 🗝️ API Keys Settings Section */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-mono uppercase tracking-wider">
                    <Key className="w-4 h-4 text-accentCyan" />
                    <span>Gemini API Key</span>
                  </div>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Enter AI API Key (optional)"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-accentCyan/50"
                  />
                  <div className="flex items-center gap-2 justify-between text-[9px] font-mono">
                    <span className="text-white/40">Status:</span>
                    {geminiApiKey ? (
                      <span className="text-accentCyan font-bold animate-pulse">Live LLM Engaged</span>
                    ) : (
                      <span className="text-white/40">Offline Demo Engine</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-[10px] font-bold tracking-wider text-white/40 uppercase font-mono">Set Study Goal / Question</span>
                  <div className="space-y-2">
                    <textarea
                      value={goalPrompt}
                      onChange={(e) => setGoalPrompt(e.target.value)}
                      placeholder="e.g. Explain photosynthesis or Blockchain details..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accentCyan/50 focus:shadow-[0_0_15px_rgba(0,245,255,0.15)] resize-none transition-all leading-relaxed"
                    />
                    <button
                      onClick={() => triggerPathwayGeneration(goalPrompt, difficultyLevel)}
                      disabled={isGenerating || !goalPrompt}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accentCyan to-accentPurple text-white text-sm font-bold py-3 transition-transform active:scale-95 disabled:opacity-50 shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isGenerating ? 'Orchestrating...' : 'Generate Pathway'}</span>
                    </button>
                  </div>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold tracking-wider text-white/40 uppercase font-mono">Suggested Presets</span>
                  <div className="space-y-1.5">
                    {[
                      { label: '⚛️ Quantum Superposition', prompt: 'Explain quantum computing superposition using analogies and create a 5-question quiz.' },
                      { label: '🌱 Photosynthesis Cycle', prompt: 'Explain how photosynthesis works, RuBisCO carbon fixation, and the thylakoid light reactions.' },
                      { label: '🔗 Blockchain Ledgers', prompt: 'Explain blockchain cryptography, decentralized consensus mechanisms, and SHA-256 blocks.' },
                      { label: '🕳️ Space Black Holes', prompt: 'Explain Schwarzschild radius event horizons, general relativity warping, and black holes.' }
                    ].map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          setGoalPrompt(preset.prompt);
                          triggerPathwayGeneration(preset.prompt, difficultyLevel);
                        }}
                        disabled={isGenerating}
                        className="w-full text-left text-[13px] p-3 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/5 hover:border-white/10 text-white/70 hover:text-white transition-all truncate"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="block text-[9px] font-bold tracking-wider text-white/30 uppercase font-mono font-semibold">Agent consensus status</span>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Brain className="w-4 h-4 text-accentCyan animate-pulse" />
                  <span>Curriculum Map Ready</span>
                </div>
              </div>
            </div>

            {/* 2. Middle Panel: Flowchart (col-span-4) */}
            <div className="col-span-12 md:col-span-5 lg:col-span-4 border-r border-white/10 bg-black/5 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-black/10 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Learning Flowchart</span>
                <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded font-mono font-bold">Dynamic Nodes</span>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6 relative">
                {currentPathway ? (
                  <>
                    <div className="absolute left-[34px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-accentCyan via-accentPurple to-emerald-500 opacity-20" />
                    
                    {currentPathway.flowchart.map((node, index) => (
                      <div key={index} className="flex gap-4 relative items-start text-left group">
                        <div className="w-9 h-9 rounded-full bg-[#050816] border border-white/10 flex items-center justify-center font-bold font-mono text-xs shadow-lg group-hover:border-accentCyan/50 transition-all z-10 flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/15 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold font-mono text-white leading-none">{node.step}</h4>
                            <span 
                              onClick={() => handleAgentNodeClick(node.agent)}
                              className="text-[9px] text-accentCyan font-mono bg-accentCyan/10 px-2 py-0.5 rounded border border-accentCyan/20 cursor-pointer hover:bg-accentCyan/20 transition-all"
                            >
                              {node.agent.replace(' Agent', '')}
                            </span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed font-sans">{node.desc}</p>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/30 text-xs">
                    No active flow mapped
                  </div>
                )}
              </div>

              {/* Console log box */}
              <div className="p-3.5 bg-black/40 border-t border-white/10 font-mono text-[10px] text-white/50 text-left">
                <div className="flex items-center gap-1.5 text-accentCyan mb-1">
                  <Terminal className="w-4 h-4" />
                  <span className="font-bold uppercase tracking-wider text-[9px]">Execution Logs</span>
                </div>
                <div className="h-20 overflow-y-auto space-y-1 text-white/40">
                  <div>[sys] pipeline initialized.</div>
                  {apiError && <div className="text-red-400 font-bold">[api-error] {apiError}</div>}
                  <div>[agent] Curriculum Agent generated modular steps.</div>
                  <div>[agent] Research Agent verified references.</div>
                  <div>[agent] Personalization Agent set difficulty: {difficultyLevel.toUpperCase()}</div>
                  <div>[sys] lesson plan ready.</div>
                </div>
              </div>
            </div>

            {/* 3. Right Panel: Dynamic Content (SINGLE SCROLLABLE COLUMN) (col-span-5) */}
            <div className="col-span-12 md:col-span-7 lg:col-span-5 flex flex-col bg-[#050816]/30 overflow-y-auto p-6 text-left">
              {currentPathway ? (
                <div className="space-y-8 pb-12">
                  
                  {/* Section 1: Header */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-accentCyan font-mono uppercase tracking-wider bg-accentCyan/10 border border-accentCyan/20 px-2.5 py-1 rounded">
                      {currentPathway.category}
                    </span>
                    <h2 className="text-3xl font-bold text-white">{currentPathway.title}</h2>
                    <p className="text-base text-white/70 leading-relaxed font-sans">
                      {currentPathway.summary}
                    </p>
                  </div>

                  {/* Section 2: Agent Constellation Orbit Map (2nd Picture) */}
                  <div className="p-5 bg-[#0a0d1a]/50 rounded-2xl border border-white/10 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-accentCyan uppercase tracking-widest font-mono block">
                        Agent Pipeline Orbit Map
                      </span>
                      <p className="text-[11px] text-white/40">
                        Click any agent node below to inspect logs, diagnostic outputs, and consensus telemetry.
                      </p>
                    </div>
                    <div className="border border-white/5 bg-black/60 rounded-xl p-2.5 flex items-center justify-center relative overflow-hidden">
                      <AIVisualization 
                        small 
                        onAgentClick={handleAgentNodeClick} 
                      />
                    </div>
                  </div>

                  {/* Section 3: Visual Diagram Pictures */}
                  <div className="p-5 bg-[#0a0d1a]/50 rounded-2xl border border-white/10 space-y-3">
                    <span className="text-[10px] font-bold text-accentCyan uppercase tracking-widest font-mono block">
                      Visual Schematic Reference
                    </span>
                    
                    <div className="h-52 rounded-xl bg-black/60 border border-white/5 flex items-center justify-center relative overflow-hidden p-3">
                      {currentPathway.diagramType === 'photosynthesis' && (
                        <svg className="w-full h-full text-emerald-400" viewBox="0 0 200 100">
                          <g stroke="#FFD700" strokeWidth="1.5">
                            <line x1="20" y1="10" x2="40" y2="30" />
                            <line x1="10" y1="20" x2="30" y2="40" />
                          </g>
                          <text x="5" y="15" fill="#FFD700" fontSize="7" fontWeight="bold">Sunlight (hv)</text>
                          <text x="15" y="75" fill="#A4F4FD" fontSize="8" fontWeight="bold">CO2</text>
                          <path d="M 35 72 L 55 55" stroke="#A4F4FD" strokeWidth="1" strokeDasharray="3,3" />
                          <path d="M 50 50 C 70 30, 130 30, 150 50 C 130 70, 70 70, 50 50 Z" fill="rgba(16,185,129,0.1)" stroke="#10B981" strokeWidth="1.5" />
                          <line x1="50" y1="50" x2="150" y2="50" stroke="#10B981" strokeWidth="0.8" />
                          <circle cx="100" cy="50" r="15" fill="none" stroke="#FF007F" strokeWidth="0.8" strokeDasharray="2,2" />
                          <text x="86" y="32" fill="#10B981" fontSize="8" fontWeight="bold">Thylakoid</text>
                          <text x="160" y="35" fill="#FF007F" fontSize="8" fontWeight="bold">O2 (Oxygen)</text>
                          <path d="M 135 42 L 155 35" stroke="#FF007F" strokeWidth="1" />
                          <text x="160" y="75" fill="#7B61FF" fontSize="8" fontWeight="bold">C6H12O6</text>
                          <path d="M 135 58 L 155 70" stroke="#7B61FF" strokeWidth="1" />
                        </svg>
                      )}

                      {currentPathway.diagramType === 'blockchain' && (
                        <svg className="w-full h-full text-accentCyan" viewBox="0 0 240 100">
                          <rect x="15" y="25" width="50" height="50" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                          <text x="25" y="42" fill="#fff" fontSize="8" fontWeight="bold">Block #1</text>
                          <text x="22" y="55" fill="rgba(255,255,255,0.4)" fontSize="6">Hash: 8a92f</text>
                          <text x="22" y="65" fill="#00F5FF" fontSize="6">Prev: 00000</text>

                          <path d="M 65 50 L 95 50" stroke="#7B61FF" strokeWidth="1.5" strokeDasharray="3,3" />
                          <circle cx="80" cy="50" r="3" fill="#7B61FF" />

                          <rect x="95" y="25" width="50" height="50" rx="6" fill="rgba(0,245,255,0.03)" stroke="#00F5FF" strokeWidth="1.5" />
                          <text x="105" y="42" fill="#fff" fontSize="8" fontWeight="bold">Block #2</text>
                          <text x="102" y="55" fill="rgba(255,255,255,0.4)" fontSize="6">Hash: 4c31d</text>
                          <text x="102" y="65" fill="#7B61FF" fontSize="6">Prev: 8a92f</text>

                          <path d="M 145 50 L 175 50" stroke="#7B61FF" strokeWidth="1.5" strokeDasharray="3,3" />
                          <circle cx="160" cy="50" r="3" fill="#7B61FF" />

                          <rect x="175" y="25" width="50" height="50" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                          <text x="185" y="42" fill="#fff" fontSize="8" fontWeight="bold">Block #3</text>
                          <text x="182" y="55" fill="rgba(255,255,255,0.4)" fontSize="6">Hash: 9f12e</text>
                          <text x="182" y="65" fill="#00F5FF" fontSize="6">Prev: 4c31d</text>
                        </svg>
                      )}

                      {currentPathway.diagramType === 'blackhole' && (
                        <svg className="w-full h-full text-accentPurple" viewBox="0 0 200 100">
                          <path d="M 10 50 Q 100 80 190 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                          <path d="M 30 50 Q 100 90 170 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                          <path d="M 50 50 Q 100 100 150 50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                          <circle cx="100" cy="50" r="22" fill="black" stroke="#7B61FF" strokeWidth="1.5" />
                          <circle cx="100" cy="50" r="2.5" fill="#fff" className="animate-ping" />
                          <ellipse cx="100" cy="50" rx="35" ry="8" fill="none" stroke="#00F5FF" strokeWidth="1.2" strokeDasharray="5,2" />
                          <text x="10" y="25" fill="#fff" fontSize="7">Flat Spacetime</text>
                          <text x="110" y="38" fill="#00F5FF" fontSize="7" fontWeight="bold">Event Horizon</text>
                          <text x="76" y="85" fill="#7B61FF" fontSize="7" fontWeight="bold">Singularity (x=0)</text>
                        </svg>
                      )}

                      {currentPathway.diagramType === 'quantum' && (
                        <svg className="w-full h-full text-accentCyan" viewBox="0 0 200 100">
                          <circle cx="100" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3,3" />
                          <ellipse cx="100" cy="50" rx="38" ry="11" fill="none" stroke="currentColor" strokeWidth="0.5" />
                          <line x1="100" y1="12" x2="100" y2="88" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                          <line x1="62" y1="50" x2="138" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                          <line x1="100" y1="50" x2="124" y2="32" stroke="#7B61FF" strokeWidth="2" />
                          <circle cx="124" cy="32" r="2.5" fill="#00F5FF" />
                          <text x="102" y="20" fill="#fff" fontSize="8" fontWeight="bold">|0⟩</text>
                          <text x="102" y="86" fill="#fff" fontSize="8" fontWeight="bold">|1⟩</text>
                          <text x="127" y="32" fill="#00F5FF" fontSize="7" fontWeight="bold">|ψ⟩ = α|0⟩ + β|1⟩</text>
                        </svg>
                      )}

                      {currentPathway.diagramType === 'generic' && (
                        <svg className="w-full h-full text-white" viewBox="0 0 200 100">
                          <circle cx="100" cy="50" r="16" fill="rgba(0,245,255,0.1)" stroke="#00F5FF" strokeWidth="1.5" />
                          <text x="80" y="53" fill="#fff" fontSize="6.5" fontWeight="bold" className="font-mono text-center">
                            {currentPathway.diagramLabels?.[0] || 'Core'}
                          </text>
                          <circle cx="40" cy="30" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                          <line x1="84" y1="44" x2="50" y2="35" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                          <text x="25" y="47" fill="rgba(255,255,255,0.4)" fontSize="6">
                            {currentPathway.diagramLabels?.[1] || 'Sub1'}
                          </text>
                          <circle cx="160" cy="30" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                          <line x1="116" y1="44" x2="150" y2="35" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                          <text x="145" y="47" fill="rgba(255,255,255,0.4)" fontSize="6">
                            {currentPathway.diagramLabels?.[2] || 'Sub2'}
                          </text>
                          <circle cx="100" cy="85" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                          <line x1="100" y1="66" x2="100" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                          <text x="85" y="98" fill="rgba(255,255,255,0.4)" fontSize="6">
                            {currentPathway.diagramLabels?.[3] || 'Sub3'}
                          </text>
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Section 4: Video Lecture */}
                  <div className="p-5 bg-[#0a0d1a]/50 rounded-2xl border border-white/10 space-y-3">
                    <span className="text-[10px] font-bold text-accentCyan uppercase tracking-widest font-mono block">
                      Topic Video Lecture / Demonstration
                    </span>
                    <p className="text-xs text-white/50">
                      Watch the complete synthetic walkthrough created for this learning pathway.
                    </p>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-black">
                      <video 
                        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Section 5: Syllabus Key Milestones */}
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <div className="flex border-b border-white/10 gap-4">
                      {currentPathway.modules.map((mod, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedModuleIdx(idx)}
                          className={`pb-2 text-xs font-bold font-mono tracking-tight transition-all relative ${
                            selectedModuleIdx === idx ? 'text-accentCyan font-bold' : 'text-white/40 hover:text-white/70'
                          }`}
                        >
                          {mod.title.split(':')[0]}
                          {selectedModuleIdx === idx && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accentCyan" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white font-mono">
                        {currentPathway.modules[selectedModuleIdx].title}
                      </h3>
                      <p className="text-base md:text-[17px] text-white/80 leading-relaxed font-sans">
                        {currentPathway.modules[selectedModuleIdx].content}
                      </p>

                      {/* Socratic Analogy */}
                      <div className="liquid-glass rounded-xl p-4.5 space-y-2 border border-white/5 bg-accentPurple/5">
                        <div className="flex items-center gap-1.5 text-xs text-accentPurple font-semibold font-mono">
                          <Video className="w-4 h-4" />
                          <span>Storytelling Analogy</span>
                        </div>
                        <p className="text-sm text-white/85 italic leading-relaxed">
                          {currentPathway.modules[selectedModuleIdx].analogy}
                        </p>
                      </div>

                      {/* Attachment */}
                      <div className="flex items-center justify-between p-3.5 rounded-lg border border-white/5 bg-white/[0.02] text-xs">
                        <div className="flex items-center gap-2 text-white/80">
                          <Paperclip className="w-4 h-4 text-white/30" />
                          <span className="font-mono">{currentPathway.modules[selectedModuleIdx].attachment}</span>
                        </div>
                        <span className="text-[10px] text-white/40 font-mono">14 KB</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 6: Quiz Assessment */}
                  <div className="border-t border-white/10 pt-8 space-y-6">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-accentCyan" />
                      <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                        Concept Assessment Check
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {currentPathway.quiz.map((q, qIdx) => {
                        const isCorrect = quizAnswers[qIdx] === q.answerIndex;
                        const isChecked = quizChecked[qIdx];

                        return (
                          <div key={qIdx} className="p-4.5 rounded-xl border border-white/5 bg-white/[0.01] space-y-4 text-left">
                            <h4 className="text-[15px] font-semibold text-white/90 font-sans leading-relaxed">
                              {qIdx + 1}. {q.question}
                            </h4>
                            
                            <div className="space-y-2">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = quizAnswers[qIdx] === optIdx;
                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => {
                                      if (!isChecked) {
                                        setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                      }
                                    }}
                                    disabled={isChecked}
                                    className={`w-full text-left text-sm p-3.5 rounded-lg border transition-all ${
                                      isSelected
                                        ? 'bg-accentCyan/10 border-accentCyan text-white'
                                        : 'bg-transparent border-white/10 text-white/70 hover:bg-white/5'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {!isChecked && (
                              <button
                                onClick={() => {
                                  if (quizAnswers[qIdx] !== undefined) {
                                    setQuizChecked(prev => ({ ...prev, [qIdx]: true }));
                                  }
                                }}
                                disabled={quizAnswers[qIdx] === undefined}
                                className="px-5 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 active:scale-95 disabled:opacity-50 transition-all"
                              >
                                Submit Answer
                              </button>
                            )}

                            {isChecked && (
                              <div className={`p-4 rounded-lg border text-sm leading-relaxed ${
                                  isCorrect 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                <div className="font-bold mb-1">
                                  {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                                </div>
                                <p className="text-white/75">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-white/30 text-xs">
                  Awaiting agent orchestration...
                </div>
              )}
            </div>

          </main>

          {/* ACTIVE GENERATION / CHECKLIST PROCESS OVERLAY */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8"
              >
                <div className="space-y-6 text-center max-w-sm w-full">
                  <div className="flex justify-center">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-accentCyan/20 animate-ping" />
                      <div className="absolute inset-2 rounded-full border-2 border-accentPurple/40 animate-pulse" />
                      <Brain className="w-8 h-8 text-accentCyan animate-bounce" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Orchestrating Cognitive Agents</h4>
                    <p className="text-xs text-white/50">Running planner and instantiating task graphs...</p>
                  </div>
                  
                  <div className="text-left bg-white/5 border border-white/10 rounded-xl p-4.5 space-y-3 text-[13px] font-mono">
                    <div className="flex items-center justify-between">
                      <span>1. Prompt Parsing & Goal Validation</span>
                      {generationStep >= 1 ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> : <Loader2 className="w-4.5 h-4.5 text-accentCyan animate-spin" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>2. Curriculum Mapping & Syllabus Structure</span>
                      {generationStep >= 2 ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> : generationStep === 1 ? <Loader2 className="w-4.5 h-4.5 text-accentCyan animate-spin" /> : <span className="w-4 h-4 border border-white/10 rounded-full" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>3. Fact-Checker Research & Sourcing</span>
                      {generationStep >= 3 ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> : generationStep === 2 ? <Loader2 className="w-4.5 h-4.5 text-accentCyan animate-spin" /> : <span className="w-4 h-4 border border-white/10 rounded-full" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>4. Lesson analogizing, Vectors & Quizzes</span>
                      {generationStep >= 4 ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> : generationStep === 3 ? <Loader2 className="w-4.5 h-4.5 text-accentCyan animate-spin" /> : <span className="w-4 h-4 border border-white/10 rounded-full" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTIVE AGENT DETAIL OVERLAYS (triggered by clicking agent nodes) */}
          <AnimatePresence>
            {activeAgentModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
              >
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="liquid-glass rounded-2xl border border-white/10 max-w-md w-full p-6 space-y-6 text-left relative"
                >
                  <button 
                    onClick={() => setActiveAgentModal(null)}
                    className="absolute top-4 right-4 text-white/50 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <LogoMark className="w-6 h-6 text-accentCyan" />
                    <h3 className="text-base font-bold font-mono text-white">{activeAgentModal} console output</h3>
                  </div>

                  {activeAgentModal === 'Research Agent' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs text-[#7B61FF] font-bold font-mono">
                        <BookOpen className="w-4 h-4" />
                        <span>Sources Verified: 100%</span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        The **Research Agent** parsed peer-reviewed publications and textbooks. Verified the physical boundaries of event horizons ($R_s = 2GM / c²$) and biological chloroplast membranes, validating consensus before output generation.
                      </p>
                    </div>
                  )}

                  {activeAgentModal === 'Analytics Agent' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs text-[#00FF7F] font-bold font-mono">
                        <LineChart className="w-4 h-4" />
                        <span>Simulated Learner Telemetry</span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed mb-3">
                        The **Analytics Agent** handles learner difficulty adaptation based on interface events:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                        <div className="p-2 bg-white/5 rounded border border-white/5">
                          <div className="text-accentCyan font-bold">14.2 sec</div>
                          <div className="text-white/40">Dwell Dwell Time</div>
                        </div>
                        <div className="p-2 bg-white/5 rounded border border-white/5">
                          <div className="text-accentPurple font-bold">88.5%</div>
                          <div className="text-white/40">Accuracy Rate</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeAgentModal === 'Personalization Agent' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs text-[#FF4500] font-bold font-mono">
                        <Sliders className="w-4 h-4" />
                        <span>Pathway Difficulty Settings</span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        The **Personalization Agent** dynamically alters the curriculum difficulty. Toggle levels using the selector at the top header to regenerate learning cards!
                      </p>
                    </div>
                  )}

                  {activeAgentModal === 'Mentor Agent' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs text-[#DA70D6] font-bold font-mono">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Educator Quality Review</span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        **Consensus Achieved**: The curriculum complies with core syllabus benchmarks. Checked for structural logic, socratic analogy safety, and visual relevance. No manual teacher changes required.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setActiveAgentModal(null)}
                    className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 active:scale-95 transition-all text-center"
                  >
                    Close Log View
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* -------------------- WATCH DEMO VIDEO PLAYER MODAL -------------------- */}
      <AnimatePresence>
        {isDemoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 bg-[#0a0d1a] shadow-2xl flex flex-col"
            >
              <div className="h-12 bg-black/40 border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <LogoMark className="w-5 h-5 text-accentCyan" />
                  <span className="font-mono text-xs text-white/70 font-semibold uppercase">IDEA Console Video Demo</span>
                </div>
                <button 
                  onClick={() => setIsDemoModalOpen(false)}
                  className="p-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative aspect-video bg-black flex items-center justify-center">
                <video 
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

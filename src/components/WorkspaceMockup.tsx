import { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  BookOpen, 
  Palette, 
  Video, 
  FileQuestion, 
  BarChart2, 
  Layers, 
  Network, 
  Clock, 
  CheckCircle2, 
  Play, 
  Settings, 
  UserCheck,
  Plus,
  Terminal,
  Paperclip,
  Activity
} from 'lucide-react';

interface TaskItem {
  id: string;
  agent: string;
  icon: any;
  task: string;
  status: 'running' | 'completed' | 'pending';
  progress: number;
  time: string;
  details: string[];
}

export const WorkspaceMockup = () => {
  const [selectedTaskId, setSelectedTaskId] = useState('task-1');
  const [goalText] = useState('Explain quantum computing superposition using analogies and create a 5-question quiz.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);


  const tasks: TaskItem[] = [
    {
      id: 'task-1',
      agent: 'Curriculum Agent',
      icon: Brain,
      task: 'Structure syllabus & modular pathway',
      status: 'completed',
      progress: 100,
      time: '9:41 AM',
      details: [
        'Mapped 3 core milestones: Qubits, Superposition, Entanglement',
        'Balanced difficulty curve for undergraduate level',
        'Linked assessments to Bloom\'s taxonomy cognitive levels'
      ]
    },
    {
      id: 'task-2',
      agent: 'Research Agent',
      icon: BookOpen,
      task: 'Source quantum analogies & verify facts',
      status: 'completed',
      progress: 100,
      time: '9:42 AM',
      details: [
        'Gathered spinning coin and musical chord superposition analogies',
        'Verified Dirac notation syntax across 4 textbooks',
        'Sourced 8 open-access visual diagrams from arXiv'
      ]
    },
    {
      id: 'task-3',
      agent: 'Visual Design Agent',
      icon: Palette,
      task: 'Render vector diagrams & Bloch sphere',
      status: 'running',
      progress: 85,
      time: '9:43 AM',
      details: [
        'Generating interactive Bloch Sphere SVG coordinates',
        'Applying brand theme gradients (#00F5FF to #7B61FF)',
        'Rendering vector qubit state transition paths'
      ]
    },
    {
      id: 'task-4',
      agent: 'Storytelling Agent',
      icon: Video,
      task: 'Script interactive lesson analogy',
      status: 'running',
      progress: 40,
      time: '9:44 AM',
      details: [
        'Drafting coin toss script: "The coin spins in mid-air..."',
        'Integrating micro-interactions at script cue points',
        'Refining narrative tone to be highly engaging'
      ]
    },
    {
      id: 'task-5',
      agent: 'Quiz Agent',
      icon: FileQuestion,
      task: 'Generate adaptive assessments',
      status: 'pending',
      progress: 0,
      time: 'Pending',
      details: [
        'Waiting for curriculum and research consolidation...',
        'Formulating 5 conceptual multiple-choice items',
        'Designing distractor feedback responses'
      ]
    },
    {
      id: 'task-6',
      agent: 'Analytics Agent',
      icon: BarChart2,
      task: 'Establish learner performance telemetry',
      status: 'pending',
      progress: 0,
      time: 'Pending',
      details: [
        'Setting up click-rate and dwell-time hooks',
        'Creating assessment response matrix schema',
        'Integrating difficulty coefficient recalculation triggers'
      ]
    }
  ];

  const activeTask = tasks.find(t => t.id === selectedTaskId) || tasks[0];

  const triggerMockGeneration = () => {
    setIsGenerating(true);
    setGenerationStep(1);
    const interval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsGenerating(false);
          return 0;
        }
        return prev + 1;
      });
    }, 2500);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0d1a]/90 backdrop-blur-2xl shadow-2xl">
      {/* Title Bar */}
      <div className="h-12 bg-black/40 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50 bg-white/5 px-4 py-1 rounded-full border border-white/5">
          <Activity className="w-3.5 h-3.5 text-accentCyan animate-pulse" />
          <span>IDEA Console — Multi-Agent Studio</span>
        </div>
        <div className="w-16" /> {/* spacer */}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-12 h-[560px] text-left">
        {/* Sidebar (col-span-3) */}
        <div className="col-span-3 border-r border-white/10 bg-black/20 p-4 flex flex-col justify-between">
          <div className="space-y-6">
            {/* New Goal Input Trigger */}
            <button 
              onClick={triggerMockGeneration}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black text-xs font-semibold px-3 py-2.5 transition-transform active:scale-95 hover:bg-white/90 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isGenerating ? 'Orchestrating...' : 'New Study Goal'}</span>
            </button>

            {/* Nav Items */}
            <div className="space-y-1">
              <span className="block text-[10px] font-bold tracking-wider text-white/40 uppercase px-2 mb-2">Workspace</span>
              <button className="w-full flex items-center justify-between text-xs font-medium px-3 py-2 rounded-lg bg-white/10 text-white">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-accentCyan" />
                  <span>Agent Pipelines</span>
                </div>
                <span className="bg-accentPurple/20 text-accentPurple px-1.5 py-0.5 rounded text-[10px] border border-accentPurple/30 font-semibold">4 Run</span>
              </button>
              <button className="w-full flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <Network className="w-3.5 h-3.5" />
                <span>Knowledge Graph</span>
              </button>
              <button className="w-full flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Mentor Oversight</span>
              </button>
              <button className="w-full flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                <Settings className="w-3.5 h-3.5" />
                <span>API Settings</span>
              </button>
            </div>

            {/* Pathways section */}
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-white/40 uppercase px-2 mb-2">Active Goals</span>
              <div className="space-y-1">
                <div className="px-3 py-1.5 rounded-md border border-white/5 bg-white/5 text-xs text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accentCyan animate-pulse" />
                  <span className="truncate">Quantum Computing</span>
                </div>
                <div className="px-3 py-1.5 rounded-md text-xs text-white/50 hover:bg-white/5 flex items-center gap-2 cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-accentPurple" />
                  <span className="truncate">CRISPR Gene Editing</span>
                </div>
                <div className="px-3 py-1.5 rounded-md text-xs text-white/50 hover:bg-white/5 flex items-center gap-2 cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="truncate">Neural Network Arch</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prompt quick preview */}
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block">Input Prompt</span>
            <p className="text-[10px] text-white/70 line-clamp-3 leading-relaxed">
              "{goalText}"
            </p>
          </div>
        </div>

        {/* Message / Task list (col-span-4) */}
        <div className="col-span-4 border-r border-white/10 bg-black/5 flex flex-col">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Terminal className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-white/40" />
              <input 
                type="text" 
                placeholder="Query execution logs..." 
                className="w-full bg-white/5 border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-accentCyan/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {tasks.map(t => {
              const Icon = t.icon;
              const isSelected = t.id === selectedTaskId;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-white/10 border-accentCyan/30 text-white shadow-lg' 
                      : 'bg-transparent border-transparent text-white/60 hover:bg-white/5 hover:text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-accentCyan' : 'text-white/50'}`} />
                      <span className="text-xs font-semibold">{t.agent}</span>
                    </div>
                    <span className="text-[10px] text-white/40">{t.time}</span>
                  </div>
                  <p className="text-[11px] truncate mb-2">{t.task}</p>
                  
                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          t.status === 'completed' 
                            ? 'bg-emerald-500' 
                            : t.status === 'running' 
                            ? 'bg-accentCyan' 
                            : 'bg-white/10'
                        }`}
                        style={{ width: `${t.progress}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-white/50">{t.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reader / Output Panel (col-span-5) */}
        <div className="col-span-5 flex flex-col bg-[#050816]/30 overflow-y-auto">
          {/* Action Header */}
          <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between flex-shrink-0 bg-black/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/70">Topic Output</span>
              <span className="bg-accentCyan/20 text-accentCyan text-[10px] px-2 py-0.5 rounded-full border border-accentCyan/30">
                Quantum
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={triggerMockGeneration}
                className="p-1 px-2 rounded bg-white/5 border border-white/10 text-[10px] text-white/70 hover:bg-white/10 flex items-center gap-1"
              >
                <Play className="w-2.5 h-2.5" />
                Run Pipeline
              </button>
            </div>
          </div>

          {/* Output Content */}
          <div className="p-4 space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Quantum Superposition Lesson Plan</h3>
              <span className="text-[10px] text-white/40 font-mono">ID: q-super-101</span>
            </div>

            {/* Sparkles Summary Card (liquid-glass styled) */}
            <div className="liquid-glass rounded-xl p-3.5 space-y-2 border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-accentLightCyan font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-accentCyan animate-pulse" />
                <span>IDEA Orchestrator Consensus Summary</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Platform dynamically spawned 4 specialized agents. Quantum superposition lesson structured around the **spinning coin analogy**. Research agent validated 3 mathematical proofs. Bloch sphere visualization is fully generated and interactive.
              </p>
            </div>

            {/* Interactive Qubit Superposition Visualizer */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-accentCyan uppercase tracking-wider">Visual Widget: Interactive Qubit</span>
                <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  Active Simulation
                </span>
              </div>
              
              {/* Bloch Sphere Mock Representation */}
              <div className="h-28 flex items-center justify-center relative">
                {/* Simulated Bloch Sphere SVG */}
                <svg className="w-24 h-24 text-accentCyan" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3,3" />
                  <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  {/* Axis */}
                  <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                  {/* State Vector */}
                  <line x1="50" y1="50" x2="78" y2="30" stroke="#7B61FF" strokeWidth="2" markerEnd="url(#arrow)" />
                  <circle cx="78" cy="30" r="2.5" fill="#00F5FF" />
                  <circle cx="50" cy="50" r="2" fill="#fff" />
                  {/* Labels */}
                  <text x="52" y="15" fill="#fff" fontSize="8" fontWeight="bold">|0⟩</text>
                  <text x="52" y="88" fill="#fff" fontSize="8" fontWeight="bold">|1⟩</text>
                  <text x="80" y="32" fill="#00F5FF" fontSize="7" fontWeight="bold">|ψ⟩</text>
                </svg>

                <div className="absolute right-4 bottom-1 text-[9px] text-white/50 text-right">
                  <div>α = 0.707</div>
                  <div>β = 0.707</div>
                  <div className="text-accentCyan">P(|0⟩) = 50%</div>
                </div>
              </div>
              <p className="text-[10px] text-white/50 text-center">
                Drag the Bloch Sphere coordinates above to test the probability amplitudes.
              </p>
            </div>

            {/* Syllabus attachment */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5 text-white/40" />
                <span className="text-[11px] text-white/80">quantum-computing-superposition.json</span>
              </div>
              <span className="text-[10px] text-white/40">12.4 KB</span>
            </div>

            {/* Agent Log Details */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">
                Selected Agent Execution Log ({activeTask.agent})
              </span>
              <div className="p-2.5 rounded bg-black/40 border border-white/5 font-mono text-[9px] text-white/70 space-y-1">
                {activeTask.details.map((detail, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-accentCyan select-none">›</span>
                    <span className="leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Generation Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 z-50">
          <div className="space-y-4 text-center max-w-sm">
            <div className="flex justify-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-accentCyan/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-accentPurple/40 animate-pulse" />
                <Brain className="w-6 h-6 text-accentCyan animate-bounce" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">IDEA Orchestrating Agents</h4>
              <p className="text-xs text-white/50">Parsing goal prompt and generating graph...</p>
            </div>
            
            {/* Step checklist */}
            <div className="text-left bg-white/5 border border-white/10 rounded-lg p-3 space-y-2 text-[10px] font-mono">
              <div className="flex items-center justify-between">
                <span>1. Prompt Parsing Engine</span>
                {generationStep >= 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-white/20" />}
              </div>
              <div className="flex items-center justify-between">
                <span>2. Syllabus Graphing Model</span>
                {generationStep >= 2 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-white/20 animate-pulse" />}
              </div>
              <div className="flex items-center justify-between">
                <span>3. Fact-Checker Synthesis</span>
                {generationStep >= 3 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-white/20" />}
              </div>
              <div className="flex items-center justify-between">
                <span>4. Media & Quiz Generator</span>
                {generationStep >= 4 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-white/20" />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

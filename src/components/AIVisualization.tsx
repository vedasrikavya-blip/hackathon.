import { motion } from 'motion/react';
import { 
  Brain, 
  BookOpen, 
  Palette, 
  Video, 
  FileQuestion, 
  BarChart2, 
  Target, 
  UserCheck, 
  Sparkles 
} from 'lucide-react';

interface AgentNode {
  name: string;
  icon: any;
  color: string;
  delay: number;
}

interface AIVisualizationProps {
  onAgentClick?: (agentName: string) => void;
  activeAgent?: string;
  small?: boolean;
}

export const AIVisualization = ({ onAgentClick, activeAgent, small = false }: AIVisualizationProps) => {
  const agents: AgentNode[] = [
    { name: 'Curriculum Agent', icon: Brain, color: '#00F5FF', delay: 0.1 },
    { name: 'Research Agent', icon: BookOpen, color: '#7B61FF', delay: 0.15 },
    { name: 'Visual Design Agent', icon: Palette, color: '#6EE7FF', delay: 0.2 },
    { name: 'Storytelling Agent', icon: Video, color: '#FF007F', delay: 0.25 },
    { name: 'Quiz Agent', icon: FileQuestion, color: '#FFD700', delay: 0.3 },
    { name: 'Analytics Agent', icon: BarChart2, color: '#00FF7F', delay: 0.35 },
    { name: 'Personalization Agent', icon: Target, color: '#FF4500', delay: 0.4 },
    { name: 'Mentor Agent', icon: UserCheck, color: '#DA70D6', delay: 0.45 }
  ];

  // Calculate coordinates for orbiting nodes
  const radius = small ? 100 : 130; // Orbit radius
  const getCoordinates = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  return (
    <div className={`relative w-full flex items-center justify-center bg-transparent select-none ${
      small ? 'h-[280px]' : 'h-[400px] md:h-[450px]'
    }`}>
      {/* Background Radial Glow */}
      <div 
        className="absolute rounded-full bg-accentCyan/10 blur-[60px] animate-pulse"
        style={{
          width: small ? '180px' : '300px',
          height: small ? '180px' : '300px'
        }}
      />
      <div 
        className="absolute rounded-full bg-accentPurple/10 blur-[40px] delay-1000 animate-pulse"
        style={{
          width: small ? '120px' : '200px',
          height: small ? '120px' : '200px'
        }}
      />

      {/* Orbit Rings */}
      <div 
        className="absolute rounded-full border border-white/5 animate-[spin_60s_linear_infinite]"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`
        }}
      />
      <div 
        className="absolute rounded-full border border-white/[0.02] border-dashed animate-[spin_90s_linear_infinite_reverse]"
        style={{
          width: `${(radius + 40) * 2}px`,
          height: `${(radius + 40) * 2}px`
        }}
      />

      {/* Interactive SVG Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7B61FF" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {agents.map((_, idx) => {
          const coords = getCoordinates(idx, agents.length);
          return (
            <g key={`lines-${idx}`}>
              <line
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${coords.x}px)`}
                y2={`calc(50% + ${coords.y}px)`}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1.5"
              />
              <line
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${coords.x}px)`}
                y2={`calc(50% + ${coords.y}px)`}
                stroke="url(#lineGrad)"
                strokeWidth="2"
                filter="url(#glow)"
                strokeDasharray="15, 80"
                strokeDashoffset="0"
                className="animate-[dash_4s_linear_infinite]"
                style={{
                  animationDelay: `${idx * 0.5}s`
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Orbiting Agent Nodes */}
      {agents.map((agent, idx) => {
        const coords = getCoordinates(idx, agents.length);
        const Icon = agent.icon;
        const isCurrentlyActive = activeAgent === agent.name;

        return (
          <motion.div
            key={agent.name}
            className="absolute z-20 flex flex-col items-center justify-center cursor-pointer"
            style={{
              x: coords.x,
              y: coords.y,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isCurrentlyActive ? 1.15 : 1, 
              opacity: 1 
            }}
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 15,
              delay: agent.delay
            }}
            whileHover={{ scale: 1.15 }}
            onClick={() => onAgentClick?.(agent.name)}
          >
            {/* Pulsing glow boundary */}
            <div 
              className={`relative rounded-full flex items-center justify-center border bg-[#050816] shadow-lg transition-all ${
                small ? 'w-10 h-10' : 'w-12 h-12'
              }`}
              style={{
                borderColor: isCurrentlyActive ? agent.color : `${agent.color}40`,
                boxShadow: isCurrentlyActive 
                  ? `0 0 20px ${agent.color}50, inset 0 0 10px ${agent.color}35` 
                  : `0 0 15px ${agent.color}15`,
              }}
            >
              <div 
                className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_10s_linear_infinite]"
                style={{ borderColor: `${agent.color}30` }}
              />
              <Icon 
                className={`transition-transform group-hover:rotate-12 ${
                  small ? 'w-4 h-4' : 'w-5 h-5'
                }`}
                style={{ color: agent.color }} 
              />
            </div>
            
            {/* Agent Label */}
            <div className="mt-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded px-1.5 py-0.5 text-[8px] md:text-[9px] text-white/70 font-semibold uppercase tracking-wider font-mono shadow-md">
              {agent.name.replace(' Agent', '')}
            </div>
          </motion.div>
        );
      })}

      {/* Central Node (Learning Goal) */}
      <motion.div 
        className="relative z-30 rounded-full bg-[#050816] border border-white/20 flex flex-col items-center justify-center text-center shadow-2xl cursor-pointer p-1"
        style={{
          width: small ? '74px' : '96px',
          height: small ? '74px' : '96px',
          boxShadow: '0 0 35px rgba(0, 245, 255, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.1)',
        }}
        animate={{
          scale: [1, 1.04, 1],
          boxShadow: [
            '0 0 30px rgba(0, 245, 255, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05)',
            '0 0 45px rgba(123, 97, 255, 0.35), inset 0 0 20px rgba(255, 255, 255, 0.15)',
            '0 0 30px rgba(0, 245, 255, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05)'
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Sparkles className={`text-accentCyan mb-0.5 animate-pulse ${
          small ? 'w-4 h-4' : 'w-5 h-5'
        }`} />
        <span className="text-[8px] md:text-[9px] font-bold text-white uppercase tracking-widest font-mono">Learning</span>
        <span className="text-[8px] md:text-[9px] font-bold text-white uppercase tracking-widest font-mono">Goal</span>
      </motion.div>
    </div>
  );
};

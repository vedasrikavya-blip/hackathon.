import { ChevronRight } from 'lucide-react';
import { AppleLogo } from './Icons';

interface AppleButtonProps {
  label?: string;
  full?: boolean;
  onClick?: () => void;
}

const AppleButton = ({ label = 'Download Aura', full = false, onClick }: AppleButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-5 py-3 transition-all hover:bg-white/90 active:scale-[0.98] ${
        full ? 'w-full' : ''
      }`}
    >
      <AppleLogo className="w-4 h-4 text-black" />
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
};

export default AppleButton;

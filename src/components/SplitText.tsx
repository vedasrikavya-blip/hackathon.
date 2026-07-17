import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const SplitText = ({ text, className = '', delay = 0 }: SplitTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Select all character elements
    const chars = el.querySelectorAll('.split-char');
    
    gsap.killTweensOf(chars);
    gsap.fromTo(
      chars,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.015,
        delay: delay,
        overwrite: 'auto',
      }
    );
  }, [text, delay]);

  // Split text into words and then characters to preserve word wrapping
  const words = text.split(' ');

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className="split-char inline-block opacity-0 transform translate-y-[30px]"
              style={{ willChange: 'transform, opacity' }}
            >
              {char}
            </span>
          ))}
          {/* Add a space span between words except the last one */}
          {wordIndex < words.length - 1 && (
            <span className="inline-block split-char opacity-0">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
};

export default SplitText;

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface OpeningProps {
  onComplete: () => void;
}

const Opening: React.FC<OpeningProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'logo' | 'exit'>('logo');

  useEffect(() => {
    // Logo animation duration, then start exit
    const timer = setTimeout(() => {
      setPhase('exit');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleExitComplete = () => {
    if (phase === 'exit') {
      onComplete();
    }
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {phase === 'logo' && (
        <motion.div
          key="opening-content"
          initial={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 bg-white"
        >
          {/* Logo Container - positioned absolutely to move with parent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
            <span
              className="text-[18px] md:text-[22px] font-medium text-black lowercase tracking-tight leading-none"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              poundynut
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Opening;

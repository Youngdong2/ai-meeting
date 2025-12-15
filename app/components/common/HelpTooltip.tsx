'use client';

import { useState } from 'react';

interface HelpTooltipProps {
  content: string | React.ReactNode;
}

export default function HelpTooltip({ content }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        className="w-4 h-4 rounded-full bg-[var(--text-tertiary)] text-white text-[10px] font-medium hover:bg-[var(--text-secondary)] transition-colors flex items-center justify-center"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-label="도움말"
      >
        ?
      </button>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white dark:bg-gray-800 border border-[var(--border)] rounded-xl shadow-lg text-caption text-[var(--text-primary)] z-50">
          <div className="relative">
            {content}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--border)]" />
          </div>
        </div>
      )}
    </span>
  );
}

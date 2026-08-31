'use client';

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { executeCommand, COMMAND_LIST } from './commands';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  text: string;
}

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BANNER = [
  '╔═══════════════════════════════════════════════════════════╗',
  '║  CYBER THREAT INTELLIGENCE TERMINAL v1.0                  ║',
  '║  Analyst: Abhimanyu Kumar  |  Station: IND-01 Pune        ║',
  '║  Type "help" for available commands                       ║',
  '╚═══════════════════════════════════════════════════════════╝',
  '',
];

export default function Terminal({ isOpen, onClose }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>(
    BANNER.map(t => ({ type: 'output', text: t }))
  );
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const submit = useCallback(() => {
    const cmd = input.trim();
    if (!cmd) return;

    // Add input line
    setLines(prev => [...prev, { type: 'input', text: cmd }]);

    if (cmd.toLowerCase() === 'clear') {
      setLines(BANNER.map(t => ({ type: 'output', text: t })));
    } else if (cmd.toLowerCase() === 'exit') {
      onClose();
    } else {
      const result = executeCommand(cmd);
      setLines(prev => [
        ...prev,
        ...result.output.map(t => ({ type: result.isError ? 'error' : 'output', text: t } as TerminalLine)),
      ]);
    }

    setHistory(prev => [cmd, ...prev.slice(0, 49)]);
    setHistoryIdx(-1);
    setInput('');
  }, [input, onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(nextIdx);
      setInput(nextIdx === -1 ? '' : history[nextIdx] ?? '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMAND_LIST.find(c => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [historyIdx, history, input, submit, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{ height: '40vh' }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <div className="h-full glass-panel rounded-none border-t border-cyber-cyan border-b-0 flex flex-col"
               style={{ background: 'rgba(2,11,24,0.97)' }}>
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-cyber-border">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyber-green animate-pulse-slow" />
                <span className="font-orbitron text-[10px] text-cyber-cyan tracking-wider">
                  THREAT TERMINAL — Ctrl+` to toggle
                </span>
              </div>
              <button
                onClick={onClose}
                className="font-orbitron text-[9px] text-cyber-dim hover:text-cyber-red transition-colors"
              >
                [ESC] CLOSE ×
              </button>
            </div>

            {/* Output */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 terminal-window">
              {lines.map((line, i) => (
                <div key={i} className={`leading-snug ${
                  line.type === 'input' ? 'text-cyber-cyan' :
                  line.type === 'error' ? 'text-cyber-red' :
                  'text-cyber-dim'
                }`}>
                  {line.type === 'input' && (
                    <span className="text-cyber-green mr-2">
                      analyst@station-india:~$
                    </span>
                  )}
                  <span style={{ fontFamily: line.type === 'output' ? 'var(--font-inter), monospace' : undefined }}>
                    {line.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Input line */}
            <div className="flex items-center gap-2 px-4 py-2 border-t border-cyber-border">
              <span className="font-orbitron text-[10px] text-cyber-green whitespace-nowrap flex-shrink-0">
                analyst@station-india:~$
              </span>
              <input
                ref={inputRef}
                className="terminal-input flex-1 text-cyber-cyan font-orbitron text-[12px]"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

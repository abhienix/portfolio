'use client';

import { useEffect, useState, useRef } from 'react';

const GLYPHS = '0123456789ABCDEF_!<>*#@$%^&*()[]{}';

interface Props {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export default function CyberScrambleText({
  text,
  className = '',
  speed = 28,
  delay = 0,
}: Props) {
  const [displayText, setDisplayText] = useState('');
  const iterationRef = useRef(0);

  useEffect(() => {
    iterationRef.current = 0;
    let timer: NodeJS.Timeout;

    const startTimer = setTimeout(() => {
      timer = setInterval(() => {
        setDisplayText(() => {
          return text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iterationRef.current) {
                return text[index];
              }
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join('');
        });

        if (iterationRef.current >= text.length) {
          clearInterval(timer);
        }

        iterationRef.current += 1 / 2;
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (timer) clearInterval(timer);
    };
  }, [text, speed, delay]);

  return <span className={className}>{displayText || text}</span>;
}

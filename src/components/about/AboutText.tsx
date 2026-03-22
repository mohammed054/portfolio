'use client';

import { useRef, useEffect, useState } from 'react';

const LINES = [
  { text: 'I build systems that don\'t need explanation.', delay: 0 },
  { text: 'My focus is clarity under complexity —', delay: 80 },
  { text: 'where performance, design, and logic converge.', delay: 160 },
  { text: '', delay: 240 },
  { text: 'No unnecessary layers.', delay: 320 },
  { text: 'No decorative engineering.', delay: 400 },
  { text: '', delay: 480 },
  { text: 'Only what holds.', delay: 560 },
];

const PRINCIPLES = [
  { symbol: '—', text: 'Systems over features' },
  { symbol: '—', text: 'Performance over abstraction' },
  { symbol: '—', text: 'Precision over volume' },
];

interface Props {
  visible: boolean;
}

export default function AboutText({ visible }: Props) {
  const [lineStates, setLineStates] = useState<boolean[]>(
    new Array(LINES.length).fill(false)
  );
  const [principlesVisible, setPrinciplesVisible] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!visible) return;

    // clear any existing
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setLineStates((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, line.delay + 200);
      timersRef.current.push(t);
    });

    const tp = setTimeout(() => {
      setPrinciplesVisible(true);
    }, 900);
    timersRef.current.push(tp);

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [visible]);

  return (
    <div className="about-text-block">
      <div className="about-body">
        {LINES.map((line, i) =>
          line.text === '' ? (
            <div key={i} className="about-line-spacer" />
          ) : (
            <p
              key={i}
              className={`about-line ${lineStates[i] ? 'in' : ''}`}
            >
              {line.text}
            </p>
          )
        )}
      </div>

      <div className={`about-principles ${principlesVisible ? 'in' : ''}`}>
        {PRINCIPLES.map((p, i) => (
          <div key={i} className="principle-row" style={{ transitionDelay: `${i * 80}ms` }}>
            <span className="principle-symbol">{p.symbol}</span>
            <span className="principle-text">{p.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

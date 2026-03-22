'use client';
import { useRef, useEffect, useState } from 'react';

const LINES = [
  'I build systems that don\'t need explanation.',
  'My focus is clarity under complexity —',
  'where performance, design, and logic converge.',
  '',
  'No unnecessary layers. No decorative engineering.',
  '',
  'Only what holds.',
];

const PRINCIPLES = [
  'Systems over features',
  'Performance over abstraction',
  'Precision over volume',
];

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setVis(true); },{threshold:0.12});
    obs.observe(el); return ()=>obs.disconnect();
  },[]);

  return (
    <section id="about" ref={ref} className="s-about">
      {/* Left: identity */}
      <div className={`s-about-id ${vis?'s-in':''}`}>
        <span className="s-label">Software Engineer</span>
        <h2 className="s-name">Mohammed<br/>Hassoun</h2>
        <div className="s-divider"/>
        <div className="s-availability">
          <span className="s-dot"/>
          <span className="s-avail-text">Available for work</span>
        </div>
        <div className="s-stats">
          <div className="s-stat"><span className="s-stat-n">5+</span><span className="s-stat-l">Years</span></div>
          <div className="s-stat"><span className="s-stat-n">40+</span><span className="s-stat-l">Projects</span></div>
          <div className="s-stat"><span className="s-stat-n">12+</span><span className="s-stat-l">Clients</span></div>
        </div>
      </div>

      {/* Right: text */}
      <div className={`s-about-txt ${vis?'s-in':''}`}>
        <div className="s-body">
          {LINES.map((line,i)=>
            line==='' ? <div key={i} style={{height:14}}/> :
            <p key={i} className="s-line" style={{transitionDelay:`${i*70+100}ms`}}>{line}</p>
          )}
        </div>
        <div className="s-principles">
          {PRINCIPLES.map((p,i)=>(
            <div key={i} className="s-principle" style={{transitionDelay:`${700+i*80}ms`}}>
              <span className="s-pr-dash">—</span>
              <span className="s-pr-text">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';
import { useRef, useEffect, useState } from 'react';
import { projects } from '@/lib/data';

export default function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:0.08});
    obs.observe(el); return ()=>obs.disconnect();
  },[]);

  return (
    <section id="projects" ref={ref} className="s-projects">
      <div className={`s-sec-header ${vis?'s-in':''}`}>
        <span className="s-label">Selected work</span>
        <h2 className="s-sec-title">Projects.</h2>
      </div>

      <div className="s-proj-grid">
        {projects.map((p,i)=>(
          <div
            key={p.id}
            className={`s-card ${vis?'s-in':''}`}
            style={{
              transitionDelay:`${i*90+200}ms`,
              '--card-color': p.color,
            } as React.CSSProperties}
          >
            <div className="s-card-bar" style={{background:p.color, boxShadow:`0 0 14px ${p.color}99`}}/>
            <div className="s-card-year">{p.year}</div>
            <h3 className="s-card-title">{p.title}</h3>
            <p className="s-card-sub">{p.subtitle}</p>
            <p className="s-card-desc">{p.description}</p>
            <div className="s-card-tags">
              {p.tags.map(t=>(
                <span key={t} className="s-tag" style={{color:p.color, background:`${p.color}18`, borderColor:`${p.color}35`}}>
                  {t}
                </span>
              ))}
            </div>
            <div className="s-card-arrow">→</div>
          </div>
        ))}
      </div>
    </section>
  );
}

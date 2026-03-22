'use client';
import { useRef, useEffect, useState } from 'react';
import { timeline } from '@/lib/data';

export default function TimelineSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const [hdr, setHdr] = useState(false);

  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting) setHdr(true); },{threshold:0.08});
    obs.observe(el);
    const onScroll=()=>{
      const items=el.querySelectorAll('.tl2-item');
      let a=-1;
      items.forEach((item,i)=>{ if(item.getBoundingClientRect().top<window.innerHeight*0.62) a=i; });
      setActive(a);
    };
    window.addEventListener('scroll',onScroll,{passive:true});
    onScroll();
    return ()=>{ obs.disconnect(); window.removeEventListener('scroll',onScroll); };
  },[]);

  return (
    <section id="timeline" ref={ref} className="s-timeline">
      <div className={`s-sec-header ${hdr?'s-in':''}`}>
        <span className="s-label">Career</span>
        <h2 className="s-sec-title">The progression.</h2>
      </div>

      <div className="tl2-wrap">
        {/* Axis line */}
        <div className="tl2-axis">
          <div className="tl2-axis-fill" style={{height:`${Math.max(0,(active+1)/timeline.length*100)}%`}}/>
        </div>

        <div className="tl2-items">
          {timeline.map((item,i)=>{
            const isActive = i===active;
            const isPast   = i<active;
            const side     = i%2===0?'left':'right';
            return (
              <div key={i} className={`tl2-item tl2-${side} ${active>=i?'tl2-vis':''} ${isActive?'tl2-active':''} ${isPast?'tl2-past':''}`}>
                <div className="tl2-year">{item.year}</div>
                <div className="tl2-node">
                  <div className="tl2-dot"/>
                  {isActive && <div className="tl2-pulse"/>}
                </div>
                <div className="tl2-card">
                  <div className="tl2-title">{item.title}</div>
                  <div className="tl2-sub">{item.subtitle}</div>
                  <div className="tl2-desc">{item.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

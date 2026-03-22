'use client';
import { useRef, useEffect, useState } from 'react';
import { testimonials } from '@/lib/data';

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:0.1});
    obs.observe(el); return ()=>obs.disconnect();
  },[]);

  return (
    <section id="contact" ref={ref} className="s-contact">
      {/* Testimonials */}
      <div className={`s-sec-header ${vis?'s-in':''}`}>
        <span className="s-label">Testimonials</span>
        <h2 className="s-sec-title">What people say.</h2>
      </div>

      <div className="s-testimonials">
        {testimonials.map((t,i)=>(
          <div key={t.id} className={`s-quote ${vis?'s-in':''}`} style={{transitionDelay:`${i*110+200}ms`}}>
            <p className="s-quote-text">"{t.text}"</p>
            <div className="s-quote-by">
              <span className="s-quote-name">{t.name}</span>
              <span className="s-quote-role">{t.role}, {t.company}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className={`s-cta-block ${vis?'s-in':''}`} style={{transitionDelay:'600ms'}}>
        <h3 className="s-cta-title">Let's build something.
        </h3>
        <p className="s-cta-sub">Available for freelance projects and consulting.</p>
        <a href="mailto:hello@mohammedhassoun.dev" className="s-cta-btn">
          Send a message →
        </a>
      </div>

      {/* Footer */}
      <div className="s-footer">
        <span className="s-footer-name">MH — Mohammed Hassoun</span>
        <span className="s-footer-copy">© {new Date().getFullYear()}</span>
      </div>
    </section>
  );
}

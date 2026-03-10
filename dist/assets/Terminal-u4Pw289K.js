import{r as o,j as i,P as s}from"./index-C1V-GCD5.js";const S=()=>{const[c,p]=o.useState(["Welcome to Browser Terminal",'Type "help" to see available commands.',"Use arrow keys to navigate command history.",""]),[d,r]=o.useState(""),[g,f]=o.useState(!0),[l,m]=o.useState(-1),u=o.useRef(null),h=o.useRef(null);o.useEffect(()=>{const a=setInterval(()=>{f(t=>!t)},500);return()=>clearInterval(a)},[]),o.useEffect(()=>{u.current&&(u.current.scrollTop=u.current.scrollHeight)},[c]);const y=()=>{h.current?.focus()},b=a=>{const t=a.trim();if(!t)return;let e="";switch(t.toLowerCase()){case"help":e=`🚀 Portfolio Terminal v1.0

Available commands:
  help      - Show this help message
  clear     - Clear the terminal
  whoami    - Display user information
  skills     - Show technical skills summary
  projects   - List portfolio projects
  education  - Display education background
  contact    - Show contact information
  date      - Show current date and time
  ls        - List directory contents
  open      - Open an application
  about     - About this terminal
  exit      - End terminal session
  
  🥚 Easter Eggs:
  sudo rm -rf / - Classic system destruction
  hack nasa     - Try your hacking skills
  konami        - Gaming code secret
  matrix        - Enter the digital realm
  sudo unlock   - Administrator access
  
  sudo      - Administrator commands`;break;case"clear":p(["🚀 Portfolio Terminal v1.0",'Type "help" to see available commands.',"Use arrow keys to navigate command history.",""]);return;case"whoami":e=`${s.name}
${s.title}
${s.location}

Specializing in:
⚛️ React & Advanced Frontend
🎨 Creative UI/UX Design  
🏗️ System Architecture
⚡ Performance Optimization`;break;case"skills":e=`📊 Technical Skills Summary

Frontend:
  React ██████████ 90%
  JavaScript ████████░ 85%
  TypeScript █████░░░░ 75%
  HTML/CSS  ██████████ 90%

Backend:
  Node.js   ████████░ 85%
  Python    ███████░░░ 80%
  APIs      ████████░ 85%

Tools:
  Git       ████████░ 85%
  Docker    █████░░░░░ 70%
  AWS       █████░░░░░ 65%

Total: 15+ technologies mastered`;break;case"projects":e=`📂 Portfolio Projects

1. 🚀 Browser OS Portfolio [COMPLETED]
   Advanced React system with window management
   
2. 🛒 E-Commerce Platform [WIP]
   Full-stack solution with payment processing
   
3. 🤖 AI Chat Assistant [PLANNING]
   ML-powered conversational interface
   
4. 📚 Component Library [COMPLETED]
   Reusable React components + TypeScript

Total: 4 projects • 3 completed • 1 in progress`;break;case"education":e=`🎓 Education Background

Bachelor of Science in Computer Science
University of Technology (2015-2019)

• GPA: 3.8/4.0 (Magn Cum Laude)
• Dean's List: 6 semesters
• President: Coding Club
• Focus: Software Engineering & UI/UX

Specialized in:
○ Frontend Development
○ User Experience Design
○ System Architecture`;break;case"contact":e=`📧 Contact Information

Primary:
  Email: ${s.email}
  Location: ${s.location}

Professional:
  LinkedIn: ${s.linkedin}
  GitHub:   ${s.github}

Available for:
○ Full-time opportunities
○ Freelance projects
○ Open source collaboration

Let's build something amazing together!`;break;case"date":e=`Current system time: ${new Date().toString()}

System uptime: ${Math.floor(Math.random()*24+1)} hours
Memory usage: ${Math.floor(Math.random()*40+30)}%
CPU usage: ${Math.floor(Math.random()*30+10)}%`;break;case"ls":e=`📁 Current Directory:

Applications/
├── 📄 About.me
├── 🚀 Projects.app
├── 💻 Skills.sys
├── 📱 Terminal.app
├── 📋 Resume.pdf
├── ✉️ Contact.app
├── ⚠️ ErrorLog.sys
└── 🗑️ Trash/

Total: 8 items • System: Healthy`;break;case"about":e=`💻 Portfolio Terminal v1.0
======================================
An interactive resume experience built entirely in the browser.

Technology Stack:
• React (Hooks & State Management)
• CSS3 (Animations & Effects)
• JavaScript (ES6+)
• Creative UI Engineering

Purpose:
• Showcase frontend development skills
• Demonstrate system-level thinking
• Provide an engaging user experience

Built with ❤️ by ${s.name}

🐛 Hidden features: Try 'sudo rm -rf /' or 'hack nasa'`;break;case"sudo unlock":e=`🔒 sudo unlock
Access denied.

Nice try! 😄

This portfolio system is already 
optimized for your viewing pleasure.

No administrator privileges needed!
• All features are accessible
• No hidden content
• Just pure engineering showcase

Enjoy exploring the apps!`;break;case"sudo rm -rf /":e=`💀 sudo rm -rf /
🚨 SYSTEM SELF-DESTRUCTION INITIATED 🚨
Just kidding... nice try though! 😄

System integrity: 100% (can't delete pure code)
Portfolio security: MAXIMUM
Your curiosity: Notable 👍

This command would delete everything,
but this portfolio is built to last!

Try 'help' for safer commands.`;break;case"hack nasa":e=`🛸 hack nasa
═══════════════════════════════════
🔐 NASA FIREWALL DETECTED
🛡️ Pentagon counter-hack initiated!
🔍 IP trace: 127.0.0.1 (your imagination)
👨‍🚀 Elon Musk: "Not again, buddy!"
🌍 International Space Station: laughing

═══════════════════════════════════
ACCESS DENIED (obviously)
Reason: This is a portfolio, not a movie

Maybe try 'projects' instead? 🚀`;break;case"konami":e=`🎮 konami
↑ ↑ ↓ ↓ ← → ← → B A

Classic gaming code detected!
Activating secret mode...
🌟 Developer mode enabled 🌟

You've unlocked:
• Infinite scroll (of this terminal)
• RGB lighting (in your imagination)
• 1337% productivity boost
• Access to the source (it's already there!)

You found the Konami egg! 🥚`;break;case"matrix":e=`💻 matrix
Wake up, Neo...
The Matrix has you...
Follow the white rabbit 🐰

Wait, wrong movie. This is just:
• React state management
• CSS animations
• JavaScript fun

No agents, just clean code! 🧹
But we do have pills:
🔴 Red pill: View source code
🔵 Blue pill: Continue exploring`;break;case"exit":e=`👋 exit
Thank you for using Portfolio Terminal v1.0!

Session statistics:
⏱️ Time spent: Precious seconds
🧠 Knowledge gained: Immeasurable
💻 Code appreciated: 100%
😄 Easter eggs found: ${Math.random()>.5?"All of them!":"Keep looking..."}

Terminal session ended.
Type 'help' to start a new adventure!

Remember: The best portfolios are interactive ✨`;break;case"sudo":e=`Usage: sudo <command>

Available sudo commands:
  sudo unlock - Easter egg command

Note: This is a demo environment.
All features are already accessible.`;break;default:t.startsWith("echo ")?e=t.substring(5):t.startsWith("open ")?e=`🚀 Opening ${t.substring(5)}...
   Use desktop icons to navigate between apps.`:t.startsWith("sudo ")?e=`sudo: ${t.substring(5)}: command not found
Type "sudo" to see available administrator commands.`:e=`❌ Command not found: ${t}
Type "help" to see available commands.`;break}p(n=>[...n,`$ ${t}`,e])},k=a=>{if(a.key==="Enter")b(d),r(""),m(-1);else if(a.key==="ArrowUp"){a.preventDefault();const t=c.filter(e=>e.startsWith("$ "));if(t.length>0){const e=Math.min(l+1,t.length-1);m(e);const n=t[t.length-1-e].substring(2);r(n)}}else if(a.key==="ArrowDown"){a.preventDefault();const t=c.filter(e=>e.startsWith("$ "));if(l>0){const e=l-1;m(e);const n=t[t.length-1-e].substring(2);r(n)}else l===0&&(m(-1),r(""))}};return i.jsxs("div",{className:"terminal",onClick:y,children:[i.jsxs("div",{className:"terminal-content",ref:u,children:[c.map((a,t)=>i.jsx("div",{className:"terminal-line",children:a},t)),i.jsxs("div",{className:"terminal-line",children:[i.jsx("span",{className:"terminal-prompt",children:"$ "}),d,i.jsx("span",{className:`terminal-cursor ${g?"visible":""}`,children:"|"})]})]}),i.jsx("input",{ref:h,type:"text",className:"terminal-input",value:d,onChange:a=>r(a.target.value),onKeyDown:k,autoFocus:!0})]})};export{S as default};

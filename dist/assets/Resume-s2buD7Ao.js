import{r as h,j as e,P as r}from"./index-C1V-GCD5.js";const y=()=>{const[s,g]=h.useState(1),[d,m]=h.useState(100),[p,x]=h.useState(!1),i={personal:{name:r.name,title:r.title,location:r.location,email:r.email,phone:r.phone,linkedin:r.linkedin,github:r.github},summary:"Passionate frontend engineer with 5+ years of experience building innovative web applications and browser-based experiences. Specialized in React, advanced UI/UX design, and system architecture. Proven track record of delivering high-performance, user-centric solutions that push the boundaries of what's possible in modern browsers.",experience:[{title:"Senior Frontend Engineer",company:"Tech Innovations Inc.",period:"2022 - Present",description:"Lead development of enterprise web applications using React and modern JavaScript frameworks.",achievements:["Improved application performance by 40% through optimization techniques","Led a team of 5 developers in implementing best practices","Implemented comprehensive CI/CD pipelines reducing deployment time by 60%"]},{title:"Full Stack Developer",company:"Digital Solutions LLC",period:"2020 - 2022",description:"Developed and maintained full-stack web applications with Node.js and React.",achievements:["Built 10+ production applications serving 100K+ users","Reduced server costs by 30% through architectural improvements","Mentored junior developers and conducted code reviews"]},{title:"Frontend Developer",company:"StartUp Hub",period:"2019 - 2020",description:"Created responsive and interactive user interfaces for various client projects.",achievements:["Delivered 20+ client projects with 100% satisfaction rate","Implemented responsive design patterns ensuring cross-device compatibility","Collaborated closely with design teams to bring concepts to life"]}],education:[{degree:"Bachelor of Science in Computer Science",school:"University of Technology",period:"2015 - 2019",gpa:"3.8/4.0",achievements:["Dean's List for 6 semesters","President of Coding Club","Graduated Magna Cum Laude"]}],skills:{frontend:["React","JavaScript","TypeScript","HTML5/CSS3","Tailwind CSS","Next.js"],backend:["Node.js","Python","Express.js","MongoDB","PostgreSQL","REST APIs"],tools:["Git","Docker","AWS","VS Code","Figma","Webpack"],soft:["Problem Solving","Team Leadership","Project Management","Communication"]}},v=async()=>{x(!0);try{const t=`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${i.personal.name} - Resume</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .name { font-size: 32px; margin: 0; color: #1a1a1a; }
            .title { font-size: 18px; color: #666; margin: 5px 0; }
            .contact { margin: 15px 0; font-size: 14px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 20px; font-weight: bold; color: #1a1a1a; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .item { margin-bottom: 20px; }
            .item-title { font-weight: bold; color: #1a1a1a; }
            .item-period { color: #666; font-style: italic; }
            .achievements { margin-left: 20px; }
            .achievements li { margin-bottom: 5px; }
            .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .skill-category { margin-bottom: 15px; }
            .skill-title { font-weight: bold; color: #1a1a1a; }
            .skill-list { display: flex; flex-wrap: wrap; gap: 5px; }
            .skill-tag { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="name">${i.personal.name}</h1>
            <p class="title">${i.personal.title}</p>
            <div class="contact">
              ${i.personal.email} | ${i.personal.phone} | ${i.personal.location}
            </div>
            <div class="contact">
              ${i.personal.linkedin} | ${i.personal.github}
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p>${i.summary}</p>
          </div>

          <div class="section">
            <h2 class="section-title">Experience</h2>
            ${i.experience.map(o=>`
              <div class="item">
                <div class="item-title">${o.title} - ${o.company}</div>
                <div class="item-period">${o.period}</div>
                <p>${o.description}</p>
                <ul class="achievements">
                  ${o.achievements.map(c=>`<li>${c}</li>`).join("")}
                </ul>
              </div>
            `).join("")}
          </div>

          <div class="section">
            <h2 class="section-title">Education</h2>
            ${i.education.map(o=>`
              <div class="item">
                <div class="item-title">${o.degree}</div>
                <div class="item-period">${o.school} | ${o.period} | GPA: ${o.gpa}</div>
                <ul class="achievements">
                  ${o.achievements.map(c=>`<li>${c}</li>`).join("")}
                </ul>
              </div>
            `).join("")}
          </div>

          <div class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-grid">
              ${Object.entries(i.skills).map(([o,c])=>`
                <div class="skill-category">
                  <div class="skill-title">${o.charAt(0).toUpperCase()+o.slice(1)}</div>
                  <div class="skill-list">
                    ${c.map(u=>`<span class="skill-tag">${u}</span>`).join("")}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </body>
        </html>
      `,a=new Blob([t],{type:"text/html"}),l=URL.createObjectURL(a),n=document.createElement("a");n.href=l,n.download=`${i.personal.name.replace(" ","_")}_Resume.html`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(l),setTimeout(()=>{x(!1),alert("Resume downloaded successfully! You can open the HTML file in your browser or print to PDF.")},1e3)}catch(t){console.error("Download failed:",t),x(!1),alert("Download failed. Please try again.")}},f=t=>{t==="in"&&d<150?m(d+10):t==="out"&&d>50?m(d-10):t==="reset"&&m(100)};return e.jsxs("div",{style:{width:"100%",height:"100%",minHeight:0,background:"#f5f5f5",display:"flex",flexDirection:"column",overflow:"hidden",transform:"none",transformOrigin:"top left"},children:[e.jsxs("div",{style:{height:"40px",background:"#e0e0e0",borderBottom:"1px solid #ccc",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{style:{fontSize:"12px",color:"#666"},children:"📄"}),e.jsxs("span",{style:{fontSize:"12px",fontWeight:"bold",color:"#333"},children:[i.personal.name,"_Resume.pdf"]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("button",{onClick:()=>g(Math.max(1,s-1)),disabled:s===1,style:{background:s===1?"#ccc":"#fff",border:"1px solid #999",borderRadius:"3px",padding:"4px 8px",fontSize:"11px",cursor:s===1?"not-allowed":"pointer"},children:"←"}),e.jsxs("span",{style:{fontSize:"12px",color:"#333"},children:["Page ",s," of 1"]}),e.jsx("button",{onClick:()=>g(Math.min(1,s+1)),disabled:s===1,style:{background:s===1?"#ccc":"#fff",border:"1px solid #999",borderRadius:"3px",padding:"4px 8px",fontSize:"11px",cursor:s===1?"not-allowed":"pointer"},children:"→"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px"},children:[e.jsx("button",{onClick:()=>f("out"),style:{background:"#fff",border:"1px solid #999",borderRadius:"3px",padding:"2px 6px",fontSize:"10px",cursor:"pointer"},children:"−"}),e.jsxs("span",{style:{fontSize:"11px",color:"#333",minWidth:"35px",textAlign:"center"},children:[d,"%"]}),e.jsx("button",{onClick:()=>f("in"),style:{background:"#fff",border:"1px solid #999",borderRadius:"3px",padding:"2px 6px",fontSize:"10px",cursor:"pointer"},children:"+"}),e.jsx("div",{style:{width:"1px",height:"20px",background:"#ccc",margin:"0 4px"}}),e.jsxs("button",{onClick:v,disabled:p,style:{background:p?"#ccc":"#007acc",color:"white",border:"none",borderRadius:"3px",padding:"4px 8px",fontSize:"10px",cursor:p?"not-allowed":"pointer"},children:[p?"⏳":"⬇"," Download"]})]})]}),e.jsx("div",{style:{flex:1,background:"white",overflow:"auto",padding:"20px",transform:`scale(${d/100})`,transformOrigin:"top center"},children:e.jsxs("div",{style:{width:"100%",maxWidth:"600px",margin:"0 auto",fontFamily:'"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',fontSize:"12px",lineHeight:"1.6",color:"#333"},children:[e.jsxs("div",{style:{textAlign:"center",borderBottom:"2px solid #333",paddingBottom:"20px",marginBottom:"30px"},children:[e.jsx("h1",{style:{fontSize:"24px",margin:"0",color:"#1a1a1a"},children:i.personal.name}),e.jsx("p",{style:{fontSize:"14px",color:"#666",margin:"5px 0"},children:i.personal.title}),e.jsxs("div",{style:{fontSize:"11px",color:"#666",margin:"15px 0"},children:[i.personal.email," | ",i.personal.phone," | ",i.personal.location]}),e.jsxs("div",{style:{fontSize:"11px",color:"#666"},children:[i.personal.linkedin," | ",i.personal.github]})]}),e.jsxs("div",{style:{marginBottom:"25px"},children:[e.jsx("h2",{style:{fontSize:"16px",fontWeight:"bold",color:"#1a1a1a",borderBottom:"1px solid #ccc",paddingBottom:"5px"},children:"Professional Summary"}),e.jsx("p",{style:{fontSize:"11px",margin:"10px 0"},children:i.summary})]}),e.jsxs("div",{style:{marginBottom:"25px"},children:[e.jsx("h2",{style:{fontSize:"16px",fontWeight:"bold",color:"#1a1a1a",borderBottom:"1px solid #ccc",paddingBottom:"5px"},children:"Experience"}),i.experience.map((t,a)=>e.jsxs("div",{style:{marginBottom:"15px"},children:[e.jsxs("div",{style:{fontWeight:"bold",color:"#1a1a1a",fontSize:"12px"},children:[t.title," - ",t.company]}),e.jsx("div",{style:{color:"#666",fontStyle:"italic",fontSize:"10px",marginBottom:"5px"},children:t.period}),e.jsx("p",{style:{fontSize:"10px",margin:"5px 0"},children:t.description}),e.jsx("ul",{style:{marginLeft:"15px",margin:"5px 0",fontSize:"10px"},children:t.achievements.map((l,n)=>e.jsx("li",{style:{marginBottom:"3px"},children:l},n))})]},a))]}),e.jsxs("div",{style:{marginBottom:"25px"},children:[e.jsx("h2",{style:{fontSize:"16px",fontWeight:"bold",color:"#1a1a1a",borderBottom:"1px solid #ccc",paddingBottom:"5px"},children:"Education"}),i.education.map((t,a)=>e.jsxs("div",{style:{marginBottom:"15px"},children:[e.jsx("div",{style:{fontWeight:"bold",color:"#1a1a1a",fontSize:"12px"},children:t.degree}),e.jsxs("div",{style:{color:"#666",fontStyle:"italic",fontSize:"10px",marginBottom:"5px"},children:[t.school," | ",t.period," | GPA: ",t.gpa]}),e.jsx("ul",{style:{marginLeft:"15px",margin:"5px 0",fontSize:"10px"},children:t.achievements.map((l,n)=>e.jsx("li",{style:{marginBottom:"3px"},children:l},n))})]},a))]}),e.jsxs("div",{children:[e.jsx("h2",{style:{fontSize:"16px",fontWeight:"bold",color:"#1a1a1a",borderBottom:"1px solid #ccc",paddingBottom:"5px"},children:"Skills"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"15px"},children:Object.entries(i.skills).map(([t,a])=>e.jsxs("div",{style:{marginBottom:"10px"},children:[e.jsx("div",{style:{fontWeight:"bold",color:"#1a1a1a",fontSize:"11px",marginBottom:"5px"},children:t.charAt(0).toUpperCase()+t.slice(1)}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"3px"},children:a.map((l,n)=>e.jsx("span",{style:{background:"#f0f0f0",padding:"1px 4px",borderRadius:"2px",fontSize:"9px",border:"1px solid #ddd"},children:l},n))})]},t))})]})]})}),e.jsxs("div",{style:{height:"24px",background:"#e0e0e0",borderTop:"1px solid #ccc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",color:"#666"},children:["Ready • ",i.personal.name,"_Resume.pdf • 1 page • HTML-to-PDF format"]})]})};export{y as default};

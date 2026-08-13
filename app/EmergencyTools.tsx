"use client";

import { useEffect, useState } from "react";

type Passport = { name?: string; communication?: string; sensitivities?: string; helps?: string; avoid?: string; contact?: string };

export default function EmergencyTools() {
  const [open, setOpen] = useState(false);
  const [passport, setPassport] = useState<Passport>({});
  const [top, setTop] = useState(["", "", ""]);

  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem("sensory-passport");
      if (raw) {
        const saved = JSON.parse(raw);
        setPassport(saved.passport ?? saved);
      }
      const topRaw = localStorage.getItem("sensory-passport-top-three");
      if (topRaw) setTop(JSON.parse(topRaw));
    } catch {}
  }, [open]);

  const saveTop = (index: number, value: string) => {
    const next = [...top];
    next[index] = value;
    setTop(next);
    localStorage.setItem("sensory-passport-top-three", JSON.stringify(next));
  };

  return <>
    <button type="button" onClick={() => setOpen(true)} style={{position:"fixed",right:18,bottom:18,zIndex:50,border:0,borderRadius:999,padding:"12px 16px",fontWeight:800,background:"#8b1e2d",color:"white"}}>Emergency / Top 3</button>
    {open && <main role="dialog" aria-modal="true" style={{position:"fixed",inset:0,zIndex:100,overflow:"auto",background:"white",color:"#17211f",padding:"24px max(20px,calc((100vw - 850px)/2))"}}>
      <button type="button" aria-label="Close" onClick={() => setOpen(false)} style={{float:"right",fontSize:28,border:0,background:"transparent"}}>×</button>
      <p style={{fontWeight:800,color:"#8b1e2d"}}>FIRST RESPONDER / EMERGENCY VIEW</p>
      <h1>{passport.name || "Sensory Passport"}</h1>
      <p>A quick communication and sensory-support guide. This is not a medical record or emergency medical instruction. Emergency care and responder protocols take priority.</p>
      <section style={{marginTop:24,padding:20,border:"3px solid #8b1e2d",borderRadius:16}}>
        <h2>Top 3 things to know</h2>
        <p>Parents/caregivers: enter the three things a new person most needs to know. Examples are ideas only—use what is true for your family member.</p>
        {["How should someone communicate or approach?","What may cause distress or overwhelm?","What usually helps?"].map((label,i)=><label key={label} style={{display:"block",marginTop:16,fontWeight:700}}>{i+1}. {label}<textarea rows={3} value={top[i] || ""} onChange={e=>saveTop(i,e.target.value)} placeholder={["Example: Use short sentences and give extra time to respond.","Example: Sudden loud sounds and unexpected touch can be overwhelming.","Example: A quiet space, headphones, and a familiar caregiver help."][i]} style={{display:"block",width:"100%",marginTop:6,padding:10,borderRadius:10,border:"1px solid #aaa",font:"inherit"}}/></label>)}
      </section>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,marginTop:20}}>
        <Card title="How I communicate" text={passport.communication}/><Card title="Sensory triggers" text={passport.sensitivities}/><Card title="What helps" text={passport.helps}/><Card title="Please avoid" text={passport.avoid}/><Card title="Support contact" text={passport.contact}/>
      </div>
      <section style={{marginTop:20,padding:18,borderRadius:14,background:"#f4f5f2"}}><h2>For responders</h2><p>When circumstances allow, introduce yourself, use clear language, explain before touching or moving the person, reduce unnecessary noise or light, allow processing time, and involve the listed support person when appropriate.</p></section>
      <button type="button" onClick={() => window.print()} style={{marginTop:20,padding:"12px 18px",border:0,borderRadius:10,fontWeight:800}}>Print / Save PDF</button>
    </main>}
  </>;
}

function Card({title,text}:{title:string;text?:string}) { return <article style={{padding:16,border:"1px solid #d8ddda",borderRadius:14}}><h2 style={{fontSize:18,marginTop:0}}>{title}</h2><p style={{whiteSpace:"pre-wrap"}}>{text || "Not provided"}</p></article>; }

"use client";

import { FormEvent, useEffect, useState } from "react";

type Passport = { name:string; pronouns:string; communication:string; sensitivities:string; helps:string; avoid:string; contact:string };
const emptyPassport: Passport = { name:"", pronouns:"", communication:"", sensitivities:"", helps:"", avoid:"", contact:"" };
const fields: { key:keyof Passport; label:string; hint:string; large?:boolean }[] = [
  { key:"name", label:"Preferred name", hint:"What should others call you?" },
  { key:"pronouns", label:"Pronouns", hint:"Optional" },
  { key:"communication", label:"How I communicate", hint:"Spoken words, AAC, gestures, extra processing time…", large:true },
  { key:"sensitivities", label:"Things I may be sensitive to", hint:"Sounds, lights, textures, crowds, smells…", large:true },
  { key:"helps", label:"What helps me feel comfortable", hint:"Quiet spaces, headphones, clear steps, breaks…", large:true },
  { key:"avoid", label:"Please avoid", hint:"Unexpected touch, rushing, loud voices…", large:true },
  { key:"contact", label:"Support person or contact", hint:"Optional name and phone number" },
];

export default function Home() {
  const [passport,setPassport] = useState<Passport>(emptyPassport);
  const [saved,setSaved] = useState(false);
  useEffect(()=>{ const stored=localStorage.getItem("sensory-passport"); if(stored){ try{setPassport(JSON.parse(stored))}catch{}} },[]);
  function update(key:keyof Passport,value:string){ setPassport(current=>({...current,[key]:value})); setSaved(false); }
  function save(event:FormEvent){ event.preventDefault(); localStorage.setItem("sensory-passport",JSON.stringify(passport)); setSaved(true); }
  const summary=`My Sensory Passport\nName: ${passport.name||"Not provided"}\nPronouns: ${passport.pronouns||"Not provided"}\n\nHow I communicate:\n${passport.communication||"Not provided"}\n\nSensitivities:\n${passport.sensitivities||"Not provided"}\n\nWhat helps:\n${passport.helps||"Not provided"}\n\nPlease avoid:\n${passport.avoid||"Not provided"}\n\nSupport contact: ${passport.contact||"Not provided"}`;
  async function copySummary(){ await navigator.clipboard.writeText(summary); setSaved(true); }
  return <main>
    <nav className="nav" aria-label="Main navigation"><a className="brand" href="#top"><span className="brandMark">SP</span><span>Sensory Passport</span></a><a className="navButton" href="#builder">Create my passport</a></nav>
    <section className="hero" id="top"><div className="heroCopy"><p className="eyebrow">Your needs. Clearly communicated.</p><h1>Make every space feel a little more <em>understanding.</em></h1><p className="lead">Create a simple, personal guide that helps schools, workplaces, healthcare providers, barbers, and community spaces understand your sensory needs.</p><div className="heroActions"><a className="primaryButton" href="#builder">Build your free passport</a><a className="textLink" href="#how">See how it works <span aria-hidden="true">↓</span></a></div><p className="privacyNote"><span aria-hidden="true">●</span> Your information stays on your device.</p></div>
      <div className="passportPreview" aria-label="Example Sensory Passport"><div className="previewTop"><span className="miniMark">SP</span><div><small>SENSORY PASSPORT</small><strong>Alex&apos;s comfort guide</strong></div></div><div className="previewSection"><span>COMMUNICATION</span><p>Please tell me what will happen before it happens. Give me a moment to respond.</p></div><div className="previewGrid"><div><span>SENSITIVE TO</span><p>Loud, sudden sounds<br/>Bright overhead lights</p></div><div><span>WHAT HELPS</span><p>Headphones<br/>Short breaks</p></div></div><div className="previewFooter">Kindness starts with understanding.</div></div></section>
    <section className="how" id="how"><p className="eyebrow">Simple by design</p><h2>A helpful guide in three steps</h2><div className="steps"><article><span>01</span><h3>Tell us what helps</h3><p>Answer a few plain-language questions about communication, sensitivities, and comfort.</p></article><article><span>02</span><h3>Save your passport</h3><p>Your answers are stored privately in your browser, ready when you need them.</p></article><article><span>03</span><h3>Print or share</h3><p>Bring a clear summary to appointments, school, work, or anywhere new.</p></article></div></section>
    <section className="builder" id="builder"><div className="sectionHeading"><p className="eyebrow">Create your passport</p><h2>What would help others support you?</h2><p>Share only what feels comfortable. Every field except your preferred name is optional.</p></div><form onSubmit={save}><div className="formGrid">{fields.map(field=><label className={field.large?"wide":""} key={field.key}><span>{field.label}</span>{field.large?<textarea value={passport[field.key]} onChange={e=>update(field.key,e.target.value)} placeholder={field.hint} rows={4}/>:<input required={field.key==="name"} value={passport[field.key]} onChange={e=>update(field.key,e.target.value)} placeholder={field.hint}/>}</label>)}</div><div className="formActions"><button className="primaryButton" type="submit">Save my passport</button><button className="secondaryButton" type="button" onClick={()=>window.print()}>Print passport</button><button className="secondaryButton" type="button" onClick={copySummary}>Copy summary</button>{saved&&<span className="savedMessage" role="status">✓ Ready to use</span>}</div></form></section>
    <section className="printPassport"><h1>Sensory Passport</h1><h2>{passport.name||"My comfort guide"}</h2>{fields.slice(1).map(field=><div key={field.key}><strong>{field.label}</strong><p>{passport[field.key]||"Not provided"}</p></div>)}</section>
    <footer><a className="brand" href="#top"><span className="brandMark">SP</span><span>Sensory Passport</span></a><p>Built to make communication kinder and spaces more inclusive.</p></footer>
  </main>;
}

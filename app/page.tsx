"use client";

import { FormEvent, useEffect, useState } from "react";

type Passport = { name:string; communication:string; sensitivities:string; helps:string; avoid:string; contact:string };
const emptyPassport: Passport = { name:"", communication:"", sensitivities:"", helps:"", avoid:"", contact:"" };
const fields: { key:keyof Passport; label:string; hint:string; large?:boolean }[] = [
  { key:"name", label:"Preferred name", hint:"What should others call you?" },
  { key:"communication", label:"How I communicate", hint:"Spoken words, AAC, gestures, extra processing time…", large:true },
  { key:"sensitivities", label:"Things I may be sensitive to", hint:"Sounds, lights, textures, crowds, smells…", large:true },
  { key:"helps", label:"What helps me feel comfortable", hint:"Quiet spaces, headphones, clear steps, breaks…", large:true },
  { key:"avoid", label:"Please avoid", hint:"Unexpected touch, rushing, loud voices…", large:true },
  { key:"contact", label:"Support person or contact", hint:"Optional name and phone number" },
];

export default function Home() {
  const [passport,setPassport] = useState<Passport>(emptyPassport);
  const [photo,setPhoto] = useState("");
  const [saved,setSaved] = useState(false);
  useEffect(()=>{ const stored=localStorage.getItem("sensory-passport"); if(stored){ try{const data=JSON.parse(stored);setPassport(data.passport??data);setPhoto(data.photo??"")}catch{}} },[]);
  function update(key:keyof Passport,value:string){ setPassport(current=>({...current,[key]:value})); setSaved(false); }
  function save(event:FormEvent){ event.preventDefault(); localStorage.setItem("sensory-passport",JSON.stringify({passport,photo})); setSaved(true); }
  function choosePhoto(file?:File){
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{ const image=new Image(); image.onload=()=>{ const canvas=document.createElement("canvas"); const size=480; canvas.width=size; canvas.height=size; const context=canvas.getContext("2d"); if(!context)return; const scale=Math.max(size/image.width,size/image.height); const width=image.width*scale; const height=image.height*scale; context.drawImage(image,(size-width)/2,(size-height)/2,width,height); setPhoto(canvas.toDataURL("image/jpeg",.82)); setSaved(false); }; image.src=String(reader.result); };
    reader.readAsDataURL(file);
  }
  const summary=`My Sensory Passport\nName: ${passport.name||"Not provided"}\n\nHow I communicate:\n${passport.communication||"Not provided"}\n\nSensitivities:\n${passport.sensitivities||"Not provided"}\n\nWhat helps:\n${passport.helps||"Not provided"}\n\nPlease avoid:\n${passport.avoid||"Not provided"}\n\nSupport contact: ${passport.contact||"Not provided"}`;
  async function copySummary(){ await navigator.clipboard.writeText(summary); setSaved(true); }
  async function shareSummary(){
    if(navigator.share){
      await navigator.share({title:`${passport.name||"My"} Sensory Passport`,text:summary});
    }else{
      await navigator.clipboard.writeText(summary);
      setSaved(true);
    }
  }
  return <main>
    <nav className="nav" aria-label="Main navigation"><a className="brand" href="#top"><span className="brandMark">SP</span><span>Sensory Passport</span></a><a className="navButton" href="#builder">Create my passport</a></nav>
    <section className="hero" id="top"><div className="heroCopy"><p className="eyebrow">Your needs. Clearly communicated.</p><h1>Make every space feel a little more <em>understanding.</em></h1><p className="lead">Create a simple, personal guide that helps schools, workplaces, healthcare providers, barbers, and community spaces understand your sensory needs.</p><div className="heroActions"><a className="primaryButton" href="#builder">Build your free passport</a><a className="textLink" href="#how">See how it works <span aria-hidden="true">↓</span></a></div><p className="privacyNote"><span aria-hidden="true">●</span> Your information stays on your device.</p></div>
      <div className="passportPreview" aria-label="Example Sensory Passport"><div className="previewTop"><span className="miniMark">SP</span><div><small>SENSORY PASSPORT</small><strong>Alex&apos;s comfort guide</strong></div></div><div className="previewSection"><span>COMMUNICATION</span><p>Please tell me what will happen before it happens. Give me a moment to respond.</p></div><div className="previewGrid"><div><span>SENSITIVE TO</span><p>Loud, sudden sounds<br/>Bright overhead lights</p></div><div><span>WHAT HELPS</span><p>Headphones<br/>Short breaks</p></div></div><div className="previewFooter">Kindness starts with understanding.</div></div></section>
    <section className="how" id="how"><p className="eyebrow">Simple by design</p><h2>A helpful guide in three steps</h2><div className="steps"><article><span>01</span><h3>Tell us what helps</h3><p>Answer a few plain-language questions about communication, sensitivities, and comfort.</p></article><article><span>02</span><h3>Save your passport</h3><p>Your answers are stored privately in your browser, ready when you need them.</p></article><article><span>03</span><h3>Print or share</h3><p>Bring a clear summary to appointments, school, work, or anywhere new.</p></article></div></section>
    <section className="builder" id="builder"><div className="sectionHeading"><p className="eyebrow">Create your passport</p><h2>What would help others support you?</h2><p>Share only what feels comfortable. Every field except your preferred name is optional.</p></div><form onSubmit={save}><div className="photoField"><div className="photoPreview">{photo?<img src={photo} alt="Selected profile"/>:<span aria-hidden="true">+</span>}</div><div><strong>Profile photo</strong><p>Optional. Choose a clear photo that helps others recognize you.</p><label className="photoButton">Choose photo<input type="file" accept="image/*" onChange={e=>choosePhoto(e.target.files?.[0])}/></label>{photo&&<button className="removePhoto" type="button" onClick={()=>setPhoto("")}>Remove</button>}</div></div><div className="formGrid">{fields.map(field=><label className={field.large?"wide":""} key={field.key}><span>{field.label}</span>{field.large?<textarea value={passport[field.key]} onChange={e=>update(field.key,e.target.value)} placeholder={field.hint} rows={4}/>:<input required={field.key==="name"} value={passport[field.key]} onChange={e=>update(field.key,e.target.value)} placeholder={field.hint}/>}</label>)}</div><div className="formActions"><button className="primaryButton" type="submit">Save my passport</button><button className="shareButton" type="button" onClick={shareSummary}>Share with a professional</button><button className="secondaryButton" type="button" onClick={()=>window.print()}>Print passport</button><button className="secondaryButton" type="button" onClick={copySummary}>Copy summary</button>{saved&&<span className="savedMessage" role="status">✓ Ready to use</span>}</div><p className="sharePrivacy">Nothing is sent until you choose a person or app from your device&apos;s share menu.</p></form></section>
    <section className="printPassport"><header className="printHeader"><div className="printPhoto">{photo?<img src={photo} alt=""/>:<span>SP</span>}</div><div><p>MY SENSORY PASSPORT</p><h1>{passport.name||"My comfort guide"}</h1></div></header><div className="printIntro">A quick guide to helping me feel comfortable, safe, and understood.</div><div className="printCards">{fields.slice(1,-1).map((field,index)=><div className={`printCard card${index+1}`} key={field.key}><strong><span>{index+1}</span>{field.label}</strong><p>{passport[field.key]||"Not provided"}</p></div>)}</div><div className="printContact"><strong>Support person or contact</strong><span>{passport.contact||"Not provided"}</span></div><footer className="printFooter">Kindness starts with understanding. • Sensory Passport</footer></section>
    <footer><a className="brand" href="#top"><span className="brandMark">SP</span><span>Sensory Passport</span></a><p>Built to make communication kinder and spaces more inclusive.</p></footer>
  </main>;
}

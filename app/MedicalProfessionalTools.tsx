"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

type Role = "doctor" | "therapist" | "dentist" | "barber";
type PassportData = {
  passport?: { name?:string; communication?:string; sensitivities?:string; helps?:string; avoid?:string; contact?:string };
  comfort?: string; beforeBegin?: string[]; cards?: string[];
};
type Field = { key:string; label:string; direction:string; example:string };

type RoleConfig = {
  label:string;
  subtitle:string;
  storageKey:string;
  fields:Field[];
  disclaimer:string;
};

const roleConfigs: Record<Role,RoleConfig> = {
  doctor:{
    label:"Medical Doctor",
    subtitle:"Quick support guide for medical visits, exams, tests, and procedures",
    storageKey:"sensory-passport-doctor",
    disclaimer:"This is a communication and accessibility aid, not a medical record, diagnosis, medication list, allergy record, or substitute for clinical judgment.",
    fields:[
      {key:"painCues",label:"Pain or distress may look like",direction:"Describe how your child or family member may show pain, fear, shutdown, or overload.",example:"Example: becomes very quiet, pulls away, paces, cries, or says 'I'm okay' even when uncomfortable."},
      {key:"touchExam",label:"Touch & physical exam preferences",direction:"Explain what makes physical exams easier and how staff should approach touch.",example:"Example: ask before touching, explain where you will touch, and let a caregiver demonstrate first."},
      {key:"needles",label:"Needles & blood draws",direction:"Share what helps before, during, and after shots or blood draws.",example:"Example: do not show the needle, use numbing cream when appropriate, no countdown, caregiver stays nearby, allow a break afterward."},
      {key:"vitals",label:"Vitals & medical equipment",direction:"Note any difficulty with cuffs, thermometers, pulse oximeters, scales, monitors, or machine sounds.",example:"Example: explain the blood-pressure cuff first, place pulse ox on the right index finger, and allow headphones."},
      {key:"medication",label:"Medication / swallowing preferences",direction:"Include only practical support needs for taking medication.",example:"Example: difficulty swallowing pills, prefers liquid when available, needs extra time and water."},
      {key:"procedures",label:"What helps during procedures",direction:"List the supports that make procedures more manageable.",example:"Example: one person speaking, dim lights, step-by-step explanation, short breaks, comfort item, or distraction."},
    ]
  },
  therapist:{
    label:"Therapist",
    subtitle:"Support guide for therapy, counseling, OT, PT, speech, or behavioral sessions",
    storageKey:"sensory-passport-therapist",
    disclaimer:"This view supports communication and accessibility during therapy. It does not replace the therapist's assessment, treatment plan, clinical documentation, or professional judgment.",
    fields:[
      {key:"arrival",label:"Starting the session",direction:"Describe what helps with arrival, transitions, and entering the therapy space.",example:"Example: give five minutes to settle in, show a visual schedule, and avoid starting with rapid questions."},
      {key:"communication",label:"Best way to communicate during sessions",direction:"Explain how the person best understands questions, choices, and instructions.",example:"Example: use short concrete sentences, offer two choices, and allow extra processing time before repeating the question."},
      {key:"regulation",label:"Regulation supports",direction:"List movements, sensory tools, breaks, or routines that help the person stay regulated.",example:"Example: movement breaks, weighted lap pad, headphones, dim lighting, or quiet corner."},
      {key:"newTasks",label:"Introducing new or difficult activities",direction:"Share how new tasks should be presented to reduce anxiety or overwhelm.",example:"Example: demonstrate first, use first-then language, start with one small step, and allow refusal without pressure."},
      {key:"overwhelm",label:"Signs of overwhelm",direction:"Describe early signs staff may notice before distress becomes severe.",example:"Example: stops talking, covers ears, repeats phrases, leaves the seat, or becomes unusually silly or restless."},
      {key:"caregiver",label:"Caregiver participation",direction:"Explain whether a caregiver should stay nearby, participate, or step out when appropriate.",example:"Example: caregiver stays in the room for the first 10 minutes and can help interpret communication when needed."},
    ]
  },
  dentist:{
    label:"Dentist",
    subtitle:"Support guide for dental exams, cleanings, X-rays, and procedures",
    storageKey:"sensory-passport-dentist",
    disclaimer:"This is an accessibility and communication aid for dental care. It does not replace dental records, medical history, consent, diagnosis, or professional judgment.",
    fields:[
      {key:"chair",label:"Dental chair & reclining",direction:"Describe tolerance for sitting back, lying flat, or changes in chair position.",example:"Example: recline slowly, warn before moving the chair, and stop before fully flat."},
      {key:"mouthTouch",label:"Mouth, face & head touch",direction:"Explain how the dentist should approach touching the mouth, face, jaw, or head.",example:"Example: ask before touching, show the mirror first, and let the patient hold it before the exam."},
      {key:"sounds",label:"Dental sounds & vibration",direction:"List sounds or vibrations that may be difficult, such as suction, polishing, drills, or ultrasonic tools.",example:"Example: suction is okay after demonstration; polishing sound is difficult; headphones help."},
      {key:"light",label:"Bright exam light",direction:"Describe whether the overhead light is tolerated and what alternatives help.",example:"Example: sunglasses help, dim the room first, and turn the exam light on only when needed."},
      {key:"xrays",label:"X-rays & items in the mouth",direction:"Note gag sensitivity, bitewing tolerance, or what helps with intraoral tools.",example:"Example: strong gag reflex, needs breaks between images, and prefers smaller sensors when available."},
      {key:"stopSignal",label:"Preferred stop / pause signal",direction:"Choose a simple signal the patient can use when they need the dentist to stop.",example:"Example: raise left hand = stop immediately; thumbs up = okay to continue."},
    ]
  },
  barber:{
    label:"Barber",
    subtitle:"Support guide for haircuts and grooming appointments",
    storageKey:"sensory-passport-barber",
    disclaimer:"This view is for communication and sensory support during grooming. It does not replace professional safety decisions or caregiver consent where required.",
    fields:[
      {key:"clippers",label:"Clipper tolerance",direction:"Describe whether clippers are okay, where they are difficult, and what makes them easier.",example:"Example: clippers are okay on the back but not near the ears; show and let them hear the clippers before starting."},
      {key:"cape",label:"Cape & neck tolerance",direction:"Explain tolerance for capes, neck strips, collars, and anything touching the neck.",example:"Example: no neck strip, keep cape loose, or use a towel instead."},
      {key:"hair",label:"Loose hair on skin",direction:"Describe how the person reacts to hair on the face, neck, or clothing and what helps.",example:"Example: brush hair off often, use a towel around the neck, and allow a shirt change after the haircut."},
      {key:"sprayDryer",label:"Spray bottle & blow dryer",direction:"Tell the barber whether water spray or dryer noise/air is tolerated.",example:"Example: spray bottle is okay after warning; no blow dryer; use a damp comb instead."},
      {key:"position",label:"Preferred haircut position",direction:"Share whether the person does best in the barber chair, caregiver's lap, standing, or another safe position.",example:"Example: starts on caregiver's lap and may move to the chair once comfortable."},
      {key:"breaks",label:"Breaks & pacing",direction:"Explain how often breaks may be needed and how the person signals for one.",example:"Example: offer a short break every 10 minutes or whenever they say 'break' or raise a hand."},
    ]
  }
};

export default function MedicalProfessionalTools(){
  const [open,setOpen]=useState(false);
  const [role,setRole]=useState<Role>("doctor");
  const [editing,setEditing]=useState(false);
  const [prefs,setPrefs]=useState<Record<string,string>>({});
  const [passport,setPassport]=useState<PassportData>({});
  const config=roleConfigs[role];
  const emptyPrefs=useMemo(()=>Object.fromEntries(config.fields.map(f=>[f.key,""])),[config]);

  useEffect(()=>{
    try{ const raw=localStorage.getItem("sensory-passport"); if(raw)setPassport(JSON.parse(raw)); }catch{}
    try{ const raw=localStorage.getItem(config.storageKey); setPrefs(raw?{...emptyPrefs,...JSON.parse(raw)}:emptyPrefs); }catch{ setPrefs(emptyPrefs); }
  },[open,role,config.storageKey,emptyPrefs]);

  function update(e:ChangeEvent<HTMLTextAreaElement>){ setPrefs(v=>({...v,[e.target.name]:e.target.value})); }
  function save(){ localStorage.setItem(config.storageKey,JSON.stringify(prefs)); setEditing(false); }
  const p=passport.passport||{};
  const comfort=passport.comfort||"Not provided";

  return <>
    <button onClick={()=>setOpen(true)} style={{position:"fixed",left:14,bottom:18,zIndex:45,border:0,borderRadius:999,padding:"12px 16px",background:"#173c42",color:"white",fontWeight:800,boxShadow:"0 8px 24px #173c4233",cursor:"pointer"}}>Professional Views</button>
    {open&&<section role="dialog" aria-modal="true" aria-label="Professional Views" style={{position:"fixed",inset:0,zIndex:120,background:"#f7f6ef",overflow:"auto",padding:"24px"}}>
      <div style={{maxWidth:1050,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"flex-start",borderBottom:"4px solid #177f78",paddingBottom:18,marginBottom:18}}>
          <div><p style={{margin:0,color:"#177f78",fontWeight:900,letterSpacing:1.2,textTransform:"uppercase",fontSize:12}}>Professional View</p><h1 style={{margin:"6px 0",fontFamily:"Georgia,serif",fontSize:42,color:"#173c42"}}>{p.name||"Sensory Passport"}</h1><p style={{margin:0,color:"#607b7e"}}>{config.subtitle}</p></div>
          <button onClick={()=>setOpen(false)} style={{width:44,height:44,border:0,borderRadius:"50%",background:"#173c42",color:"white",fontSize:28,cursor:"pointer"}} aria-label="Close professional views">×</button>
        </div>

        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>{(Object.keys(roleConfigs) as Role[]).map(key=><button key={key} onClick={()=>{setRole(key);setEditing(false)}} style={{border:role===key?"2px solid #177f78":"1px solid #b9d1cb",borderRadius:999,padding:"10px 15px",background:role===key?"#dff3ec":"white",fontWeight:800,cursor:"pointer"}}>{roleConfigs[key].label}</button>)}</div>

        {!editing?<>
          <div style={{background:"#fff1cc",borderLeft:"7px solid #e6a94b",padding:18,borderRadius:14,marginBottom:16}}><strong>Before you begin</strong><p style={{margin:"8px 0 0"}}>{passport.beforeBegin?.length?passport.beforeBegin.join(" • "):"No specific instructions selected."}</p></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
            <article style={{background:"white",padding:18,borderRadius:14}}><strong>Communication</strong><p>{p.communication||"Not provided"}</p></article>
            <article style={{background:"white",padding:18,borderRadius:14}}><strong>Current comfort level</strong><p style={{textTransform:"capitalize"}}>{comfort}</p></article>
            <article style={{background:"white",padding:18,borderRadius:14}}><strong>Sensory triggers</strong><p>{p.sensitivities||"Not provided"}</p></article>
            <article style={{background:"white",padding:18,borderRadius:14}}><strong>What helps</strong><p>{p.helps||"Not provided"}</p></article>
            <article style={{background:"white",padding:18,borderRadius:14}}><strong>Please avoid</strong><p>{p.avoid||"Not provided"}</p></article>
            <article style={{background:"white",padding:18,borderRadius:14}}><strong>Support contact</strong><p>{p.contact||"Not provided"}</p></article>
            {config.fields.map(f=><article key={f.key} style={{background:"white",padding:18,borderRadius:14,borderTop:"4px solid #177f78"}}><strong>{f.label}</strong><p style={{whiteSpace:"pre-wrap"}}>{prefs[f.key]||"Not provided"}</p></article>)}
          </div>
          {passport.cards?.length?<div style={{marginTop:16,background:"#dff3ec",padding:16,borderRadius:14}}><strong>Quick communication messages</strong><p style={{margin:"8px 0 0"}}>{passport.cards.join(" • ")}</p></div>:null}
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:18}}><button onClick={()=>setEditing(true)} style={{border:0,borderRadius:999,padding:"12px 18px",background:"#177f78",color:"white",fontWeight:800,cursor:"pointer"}}>Add / edit {config.label.toLowerCase()} notes</button><button onClick={()=>window.print()} style={{border:"1px solid #b9d1cb",borderRadius:999,padding:"12px 18px",background:"white",fontWeight:800,cursor:"pointer"}}>Print / Save PDF</button></div>
          <p style={{fontSize:12,color:"#607b7e",marginTop:18}}>{config.disclaimer}</p>
        </>:<>
          <h2 style={{fontFamily:"Georgia,serif",color:"#173c42"}}>Help {config.label.toLowerCase()} understand what works</h2>
          <div style={{background:"#eaf6f2",padding:16,borderRadius:14,marginBottom:18}}><strong>Directions for parents & caregivers</strong><p style={{margin:"8px 0 0"}}>Write only what is true for your child or family member. You do not need to use medical words. Short, specific examples are often the most helpful. The examples below are ideas only—do not select or copy something unless it accurately describes the person.</p></div>
          <div style={{display:"grid",gap:16}}>{config.fields.map(f=><label key={f.key} style={{fontWeight:800,color:"#173c42",background:"white",padding:16,borderRadius:14}}>{f.label}<span style={{display:"block",fontWeight:500,color:"#607b7e",marginTop:6}}>{f.direction}</span><span style={{display:"block",fontWeight:500,color:"#177f78",marginTop:5,fontSize:13}}>{f.example}</span><textarea name={f.key} value={prefs[f.key]||""} onChange={update} placeholder="Type your own answer here…" rows={3} style={{width:"100%",marginTop:10,border:"1px solid #c9d8d4",borderRadius:12,padding:12,resize:"vertical"}}/></label>)}</div>
          <div style={{display:"flex",gap:10,marginTop:18}}><button onClick={save} style={{border:0,borderRadius:999,padding:"12px 18px",background:"#177f78",color:"white",fontWeight:800,cursor:"pointer"}}>Save {config.label.toLowerCase()} notes</button><button onClick={()=>setEditing(false)} style={{border:"1px solid #b9d1cb",borderRadius:999,padding:"12px 18px",background:"white",fontWeight:800,cursor:"pointer"}}>Cancel</button></div>
        </>}
      </div>
    </section>}
  </>;
}

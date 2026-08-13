"use client";

import { FormEvent, useState } from "react";

const SUPABASE_URL = "https://jlkcuvwbwyuhrjluadmf.supabase.co";
const SUPABASE_KEY = "sb_publishable_DiYtRDfhYyyv7bRYpNENoQ_wDggJIbv";

const roles = [
  ["parent_caregiver","Parent / caregiver"],["individual","Individual using my own passport"],
  ["teacher","Teacher / school staff"],["therapist","Therapist"],["medical_professional","Medical professional"],
  ["dentist","Dentist / dental staff"],["barber","Barber / stylist"],["first_responder","First responder"],["other","Other"]
];

export default function FeedbackTools(){
  const [open,setOpen]=useState(false); const [sending,setSending]=useState(false); const [done,setDone]=useState(false); const [error,setError]=useState("");
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setSending(true); setError("");
    const fd=new FormData(e.currentTarget);
    const body={role:fd.get("role"),ease_rating:Number(fd.get("ease")),usefulness_rating:Number(fd.get("useful")),most_helpful:fd.get("helpful")||null,confusing:fd.get("confusing")||null,suggestions:fd.get("suggestions")||null,recommend:fd.get("recommend"),consent_improve:fd.get("consent")==="on"};
    if(!body.consent_improve){setError("Please confirm that your feedback may be used to improve Sensory Passport.");setSending(false);return;}
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/product_feedback`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"return=minimal"},body:JSON.stringify(body)});
      if(!r.ok) throw new Error("Feedback could not be sent."); setDone(true);
    }catch{setError("We couldn't send your feedback right now. Please try again later.");}finally{setSending(false);}
  }
  return <>
    <button type="button" onClick={()=>{setOpen(true);setDone(false)}} style={{position:"fixed",left:18,bottom:18,zIndex:45,border:"1px solid #177f78",borderRadius:999,padding:"11px 15px",fontWeight:800,background:"white",color:"#126b65"}}>Give Feedback</button>
    {open&&<div role="dialog" aria-modal="true" aria-label="Sensory Passport feedback" style={{position:"fixed",inset:0,zIndex:120,overflow:"auto",background:"#fff",color:"#17211f",padding:"24px max(20px,calc((100vw - 700px)/2))"}}>
      <button type="button" onClick={()=>setOpen(false)} aria-label="Close" style={{float:"right",fontSize:28,border:0,background:"transparent"}}>×</button>
      <p style={{fontWeight:800,color:"#177f78"}}>SENSORY PASSPORT</p><h1>Tell us what you think</h1>
      <p>Your feedback helps improve Sensory Passport. Please do not include medical details, passport information, addresses, phone numbers, names, or other sensitive personal information.</p>
      {done?<section style={{marginTop:30,padding:24,border:"1px solid #b9d8d5",borderRadius:16}}><h2>Thank you!</h2><p>Your feedback was submitted and will help us improve Sensory Passport.</p><button onClick={()=>setOpen(false)}>Close</button></section>:
      <form onSubmit={submit} style={{display:"grid",gap:18,marginTop:26}}>
        <label>Which best describes you?<select name="role" required defaultValue="" style={field}><option value="" disabled>Select one</option>{roles.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
        <Rating name="ease" label="How easy was Sensory Passport to use?"/><Rating name="useful" label="How useful would this be in a real situation?"/>
        <Text name="helpful" label="What was most helpful?"/><Text name="confusing" label="Was anything confusing or difficult?"/><Text name="suggestions" label="What would you add or change?"/>
        <label>Would you recommend Sensory Passport?<select name="recommend" required defaultValue="" style={field}><option value="" disabled>Select one</option><option value="yes">Yes</option><option value="maybe">Maybe</option><option value="no">No</option></select></label>
        <label style={{display:"flex",gap:10,alignItems:"flex-start"}}><input name="consent" type="checkbox" required/> <span>I understand my feedback may be used to improve Sensory Passport.</span></label>
        <p style={{fontSize:14}}>This form does not automatically attach or submit your Sensory Passport information.</p>{error&&<p role="alert" style={{fontWeight:700}}>{error}</p>}
        <button disabled={sending} type="submit" style={{padding:"13px 18px",border:0,borderRadius:10,fontWeight:800,background:"#177f78",color:"white"}}>{sending?"Sending…":"Submit Feedback"}</button>
      </form>}
    </div>}
  </>;
}
const field={display:"block",width:"100%",marginTop:7,padding:11,borderRadius:9,border:"1px solid #aaa",font:"inherit"} as const;
function Rating({name,label}:{name:string;label:string}){return <label>{label}<select name={name} required defaultValue="" style={field}><option value="" disabled>Select 1–5</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}{n===1?" — Low":n===5?" — Excellent":""}</option>)}</select></label>}
function Text({name,label}:{name:string;label:string}){return <label>{label}<textarea name={name} rows={3} maxLength={1500} style={field}/></label>}

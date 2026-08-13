"use client";

import { FormEvent, useState } from "react";

export default function DepartmentAccessRequestPage(){
  const [submitted,setSubmitted]=useState(false);
  const [preview,setPreview]=useState<Record<string,string>>({});

  function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    const next:Record<string,string>={};
    for(const [k,v] of fd.entries()) next[k]=String(v);
    setPreview(next); setSubmitted(true);
  }

  return <main style={{maxWidth:820,margin:"0 auto",padding:"40px 22px",fontFamily:"Arial,sans-serif",color:"#17211f"}}>
    <p style={{fontWeight:800,color:"#8b1e2d",letterSpacing:1}}>SENSORY PASSPORT</p>
    <h1 style={{fontSize:"clamp(32px,6vw,50px)",marginBottom:8}}>Department Access Request</h1>
    <p style={{fontSize:18,lineHeight:1.6}}>For fire, EMS, dispatch, law-enforcement, and emergency-management agencies that want to participate in the Sensory Passport responder program.</p>
    <div style={{marginTop:20,padding:16,border:"1px solid #d9b26d",borderRadius:12,background:"#fff9ec"}}><strong>Prototype only:</strong> this page does not transmit or store department information yet. It is for testing the request workflow before secure approval storage is enabled.</div>

    {!submitted?<form onSubmit={submit} style={{display:"grid",gap:16,marginTop:28}}>
      <label>Department name<input name="department_name" required style={field}/></label>
      <label>Department type<select name="department_type" required defaultValue="" style={field}><option value="" disabled>Select one</option><option>Fire</option><option>EMS</option><option>Dispatch / 911</option><option>Law enforcement</option><option>Emergency management</option><option>Other</option></select></label>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}><label>City<input name="city" required style={field}/></label><label>State / region<input name="state_region" required style={field}/></label></div>
      <label>Requester's name<input name="requester_name" required style={field}/></label>
      <label>Title / position<input name="requester_title" required placeholder="Example: Fire Chief, EMS Director, Dispatch Supervisor" style={field}/></label>
      <label>Official department email<input name="official_email" type="email" required style={field}/></label>
      <label>Official department phone<input name="official_phone" type="tel" style={field}/></label>
      <label>Department website<input name="website" type="url" style={field}/></label>
      <label style={{display:"flex",gap:10,alignItems:"flex-start"}}><input type="checkbox" required/><span>I certify that I am authorized to request access on behalf of this department and understand that submission does not guarantee approval.</span></label>
      <button type="submit" style={button}>Preview Request</button>
    </form>:<section style={{marginTop:28,padding:22,border:"1px solid #cfd8d5",borderRadius:16}}><h2>Request preview</h2><p>This is how the request will appear to a Sensory Passport administrator once secure submission is enabled.</p>{Object.entries(preview).map(([k,v])=><p key={k}><strong>{k.replaceAll("_"," ")}:</strong> {v||"—"}</p>)}<p style={{marginTop:20,fontWeight:700}}>Status: Draft / not submitted</p><button type="button" onClick={()=>setSubmitted(false)} style={button}>Edit Request</button></section>}

    <section style={{marginTop:32,padding:18,borderRadius:14,background:"#f4f5f2"}}><h2>What happens after submission?</h2><p>Sensory Passport will verify the agency and the requesting leader. Approved departments can then designate department administrators and add individual responder accounts. Individual responders must still be verified before portal access is activated.</p></section>
  </main>;
}

const field={display:"block",width:"100%",marginTop:7,padding:12,borderRadius:9,border:"1px solid #aaa",font:"inherit"} as const;
const button={padding:"13px 18px",border:0,borderRadius:10,fontWeight:800,background:"#8b1e2d",color:"white",cursor:"pointer"} as const;

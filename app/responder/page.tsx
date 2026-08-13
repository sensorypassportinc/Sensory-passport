"use client";

import { FormEvent, useState } from "react";

const SUPABASE_URL = "https://jlkcuvwbwyuhrjluadmf.supabase.co";
const SUPABASE_KEY = "sb_publishable_DiYtRDfhYyyv7bRYpNENoQ_wDggJIbv";

type Membership = { id:string; role:string; professional_type:string|null; verified_at:string|null; organization:{ id:string; name:string; organization_type:string; verified_at:string|null } };

export default function ResponderLogin(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [loading,setLoading]=useState(false); const [error,setError]=useState(""); const [membership,setMembership]=useState<Membership|null>(null);
  async function signIn(e:FormEvent){e.preventDefault();setLoading(true);setError("");try{
    const auth=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY},body:JSON.stringify({email,password})});
    const session=await auth.json(); if(!auth.ok||!session.access_token||!session.user?.id) throw new Error("Email or password was not accepted.");
    const select=encodeURIComponent("id,role,professional_type,verified_at,organization:provider_organizations!inner(id,name,organization_type,verified_at)");
    const r=await fetch(`${SUPABASE_URL}/rest/v1/provider_members?select=${select}&user_id=eq.${session.user.id}`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`}}); const members=await r.json();
    if(!r.ok) throw new Error("We couldn't verify your department membership."); const m=(members as Membership[]).find(x=>x.organization?.organization_type==="emergency_response");
    if(!m) throw new Error("This account is not assigned to an emergency-response department."); if(!m.verified_at||!m.organization.verified_at) throw new Error("Your department or responder access is still awaiting verification."); setMembership(m);
  }catch(err){setError(err instanceof Error?err.message:"Unable to sign in.");}finally{setLoading(false)}}
  if(membership)return <main style={wrap}><div style={card}><p style={eyebrow}>VERIFIED RESPONDER PORTAL</p><h1>Welcome</h1><p><strong>{membership.organization.name}</strong></p><p>Role: {pretty(membership.professional_type||membership.role)}</p><div style={notice}><strong>Access verified</strong><p>This prototype confirms department membership and individual verification before opening the responder portal.</p></div><section style={{marginTop:24}}><h2>Emergency Registry lookup</h2><p>Address lookup is intentionally disabled in this prototype. The next phase will add restricted, audited lookup only after the registry storage and privacy controls are approved.</p></section><section style={{marginTop:20}}><h2>Planned safeguards</h2><p>Every future lookup will require verified agency membership, a legitimate response reason, least-privilege access, and an audit record. Responders will see only the emergency summary authorized by the family.</p></section><button type="button" onClick={()=>{setMembership(null);setPassword("")}} style={button}>Sign out</button></div></main>;
  return <main style={wrap}><div style={card}><p style={eyebrow}>SENSORY PASSPORT</p><h1>First Responder Department Login</h1><p>For approved fire, EMS, dispatch, law-enforcement, and emergency-management personnel. Department and responder access must both be verified.</p><form onSubmit={signIn} style={{display:"grid",gap:16,marginTop:24}}><label>Email<input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} style={field}/></label><label>Password<input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} style={field}/></label>{error&&<p role="alert" style={{fontWeight:700,color:"#8b1e2d"}}>{error}</p>}<button type="submit" disabled={loading} style={button}>{loading?"Verifying…":"Sign in & verify department"}</button></form><div style={notice}><strong>Department access is not automatic.</strong><p>A regular Sensory Passport account does not grant responder access. An approved department membership and verification are required.</p></div><a href="/" style={{display:"inline-block",marginTop:22}}>← Back to Sensory Passport</a></div></main>;
}
function pretty(v:string){return v.split("_").map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join(" ")}
const wrap={minHeight:"100vh",background:"#f2f5f3",padding:"48px 18px",color:"#17211f"} as const;
const card={maxWidth:650,margin:"0 auto",background:"white",padding:"clamp(22px,5vw,42px)",borderRadius:18,boxShadow:"0 12px 35px #00000012"} as const;
const eyebrow={fontWeight:900,letterSpacing:1,color:"#8b1e2d"} as const;
const field={display:"block",width:"100%",marginTop:7,padding:12,border:"1px solid #aab3af",borderRadius:9,font:"inherit"} as const;
const button={marginTop:4,padding:"13px 18px",border:0,borderRadius:10,fontWeight:800,background:"#8b1e2d",color:"white",cursor:"pointer"} as const;
const notice={marginTop:24,padding:16,borderRadius:12,background:"#f5f3ef"} as const;

"use client";

import { FormEvent, useState } from "react";

const SUPABASE_URL = "https://jlkcuvwbwyuhrjluadmf.supabase.co";
const SUPABASE_KEY = "sb_publishable_DiYtRDfhYyyv7bRYpNENoQ_wDggJIbv";

type Member = {
  verified_at: string | null;
  role: string;
  professional_type: string | null;
  organization_id: string;
  provider_organizations?: { name?: string; organization_type?: string; verified_at?: string | null } | null;
};

export default function ResponderPage() {
  const [status, setStatus] = useState<"idle"|"checking"|"approved"|"denied">("idle");
  const [message, setMessage] = useState("");
  const [member, setMember] = useState<Member | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus("checking"); setMessage(""); setMember(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    try {
      const auth = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
        body: JSON.stringify({ email, password })
      });
      if (!auth.ok) throw new Error("Invalid email or password.");
      const session = await auth.json();
      const token = session.access_token as string;
      const userId = session.user?.id as string;
      const rows = await fetch(`${SUPABASE_URL}/rest/v1/provider_members?user_id=eq.${encodeURIComponent(userId)}&select=verified_at,role,professional_type,organization_id,provider_organizations(name,organization_type,verified_at)`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` }
      });
      if (!rows.ok) throw new Error("Responder access could not be verified.");
      const data = await rows.json() as Member[];
      const approved = data.find((m) => m.verified_at && m.provider_organizations?.verified_at && m.provider_organizations?.organization_type === "emergency_response");
      if (!approved) {
        setStatus("denied");
        setMessage("Your account is signed in, but verified emergency-response department access is not active yet.");
        return;
      }
      setMember(approved); setStatus("approved");
    } catch (err) {
      setStatus("denied"); setMessage(err instanceof Error ? err.message : "Sign-in failed.");
    }
  }

  return <main style={{maxWidth:760,margin:"0 auto",padding:"40px 22px",fontFamily:"Arial,sans-serif",color:"#17211f"}}>
    <p style={{fontWeight:800,color:"#8b1e2d",letterSpacing:1}}>SENSORY PASSPORT</p>
    <h1 style={{fontSize:"clamp(32px,6vw,52px)",marginBottom:8}}>First Responder Portal</h1>
    <p style={{fontSize:18,lineHeight:1.6}}>This portal is for verified fire, EMS, dispatch, law-enforcement, and emergency-management personnel. Account access alone does not authorize address lookup or access to family information.</p>

    {status!=="approved" ? <form onSubmit={submit} style={{display:"grid",gap:16,marginTop:28,padding:22,border:"1px solid #d7dcda",borderRadius:16}}>
      <label>Department email<input name="email" type="email" required autoComplete="username" style={field}/></label>
      <label>Password<input name="password" type="password" required autoComplete="current-password" style={field}/></label>
      <button disabled={status==="checking"} style={{padding:"13px 18px",border:0,borderRadius:10,fontWeight:800,background:"#8b1e2d",color:"white"}}>{status==="checking"?"Verifying…":"Sign in"}</button>
      {status==="denied" && <p role="alert" style={{fontWeight:700}}>{message}</p>}
    </form> : <section style={{marginTop:28,padding:24,border:"2px solid #2b7a4b",borderRadius:16}}>
      <h2>Verified responder access</h2>
      <p><strong>Department:</strong> {member?.provider_organizations?.name || "Verified emergency-response organization"}</p>
      <p><strong>Role:</strong> {member?.professional_type || member?.role}</p>
      <p style={{marginTop:20}}>The responder portal is active, but address-based family lookup is intentionally disabled in this version. The next phase will require a legitimate response reason, least-privilege access, and an audit record for every lookup before any emergency-summary information can be displayed.</p>
    </section>}

    <section style={{marginTop:30,padding:18,borderRadius:14,background:"#f4f5f2"}}>
      <h2>Access rules</h2>
      <p>Only verified personnel in a verified emergency-response organization should receive portal access. Sensory Passport should never be used for casual browsing, background checks, or non-response purposes.</p>
    </section>
  </main>;
}

const field={display:"block",width:"100%",marginTop:7,padding:12,borderRadius:9,border:"1px solid #aaa",font:"inherit"} as const;

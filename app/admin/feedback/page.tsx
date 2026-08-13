"use client";

import { FormEvent, useState } from "react";

type Feedback = {
  id: string;
  role: string;
  ease_rating: number;
  usefulness_rating: number;
  most_helpful: string | null;
  confusing: string | null;
  suggestions: string | null;
  recommend: string;
  created_at: string;
};

type DashboardData = {
  total: number;
  avgEase: number | null;
  avgUsefulness: number | null;
  recommendations: { yes: number; maybe: number; no: number };
  rows: Feedback[];
};

export default function FeedbackAdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function unlock(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError("");
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("Access denied.");
      setData(await res.json());
    } catch {
      setError("Access denied or dashboard is not configured yet.");
    } finally {
      setLoading(false);
    }
  }

  if (!data) return <main style={{maxWidth:560,margin:"0 auto",padding:"48px 22px",fontFamily:"Arial,sans-serif",color:"#17211f"}}>
    <p style={{fontWeight:800,color:"#177f78"}}>SENSORY PASSPORT</p>
    <h1>Private Feedback Dashboard</h1>
    <p>This area is for the Sensory Passport owner only.</p>
    <form onSubmit={unlock} style={{display:"grid",gap:14,marginTop:24,padding:22,border:"1px solid #d7dcda",borderRadius:16}}>
      <label>Admin password<input name="password" type="password" required autoComplete="current-password" style={field}/></label>
      <button disabled={loading} style={{padding:"13px 18px",border:0,borderRadius:10,fontWeight:800,background:"#177f78",color:"white"}}>{loading?"Opening…":"Open Dashboard"}</button>
      {error && <p role="alert" style={{fontWeight:700}}>{error}</p>}
    </form>
  </main>;

  return <main style={{maxWidth:1050,margin:"0 auto",padding:"40px 22px",fontFamily:"Arial,sans-serif",color:"#17211f"}}>
    <p style={{fontWeight:800,color:"#177f78"}}>SENSORY PASSPORT</p>
    <h1>Feedback Dashboard</h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12,margin:"22px 0"}}>
      <Stat label="Responses" value={String(data.total)}/>
      <Stat label="Avg. ease" value={data.avgEase?.toFixed(1) ?? "—"}/>
      <Stat label="Avg. usefulness" value={data.avgUsefulness?.toFixed(1) ?? "—"}/>
      <Stat label="Recommend: Yes" value={String(data.recommendations.yes)}/>
    </div>
    <section style={{marginTop:28}}><h2>Recent feedback</h2>
      {data.rows.length===0?<p>No feedback has been submitted yet.</p>:data.rows.map(row=><article key={row.id} style={{padding:18,border:"1px solid #d7dcda",borderRadius:14,marginBottom:12}}>
        <p><strong>{roleLabel(row.role)}</strong> · {new Date(row.created_at).toLocaleString()}</p>
        <p><strong>Ease:</strong> {row.ease_rating}/5 · <strong>Usefulness:</strong> {row.usefulness_rating}/5 · <strong>Recommend:</strong> {row.recommend}</p>
        {row.most_helpful&&<p><strong>Most helpful:</strong> {row.most_helpful}</p>}
        {row.confusing&&<p><strong>Confusing/difficult:</strong> {row.confusing}</p>}
        {row.suggestions&&<p><strong>Suggestions:</strong> {row.suggestions}</p>}
      </article>)}
    </section>
  </main>;
}

const field={display:"block",width:"100%",marginTop:7,padding:12,borderRadius:9,border:"1px solid #aaa",font:"inherit"} as const;
function Stat({label,value}:{label:string;value:string}){return <div style={{padding:18,border:"1px solid #d7dcda",borderRadius:14}}><div style={{fontSize:13,fontWeight:700}}>{label}</div><div style={{fontSize:30,fontWeight:800,marginTop:4}}>{value}</div></div>}
function roleLabel(v:string){return ({parent_caregiver:"Parent / caregiver",individual:"Individual",teacher:"Teacher / school staff",therapist:"Therapist",medical_professional:"Medical professional",dentist:"Dentist / dental staff",barber:"Barber / stylist",first_responder:"First responder",other:"Other"} as Record<string,string>)[v]||v}

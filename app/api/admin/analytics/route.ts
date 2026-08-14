import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const configuredPassword = process.env.FEEDBACK_ADMIN_PASSWORD;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = "https://jlkcuvwbwyuhrjluadmf.supabase.co";
  if (!configuredPassword || !serviceRoleKey) return NextResponse.json({ error: "Dashboard not configured" }, { status: 503 });
  const { password } = await request.json();
  if (typeof password !== "string" || password !== configuredPassword) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const res = await fetch(`${supabaseUrl}/rest/v1/analytics_events?select=session_id,event_name,created_at&created_at=gte.${encodeURIComponent(since)}&order=created_at.desc&limit=10000`, {
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }, cache: "no-store"
  });
  if (!res.ok) return NextResponse.json({ error: "Could not load analytics" }, { status: 500 });
  const rows: {session_id:string;event_name:string;created_at:string}[] = await res.json();
  const count = (name:string) => rows.filter(r=>r.event_name===name).length;
  const unique = (name:string) => new Set(rows.filter(r=>r.event_name===name).map(r=>r.session_id)).size;
  const visitors = unique("page_view");
  const starts = unique("builder_start");
  const saves = unique("passport_saved");
  const shares = unique("share_action");
  const days: Record<string,{visitors:Set<string>;starts:number;saves:number;shares:number}> = {};
  for (const r of rows) {
    const day=r.created_at.slice(0,10); days[day] ??= {visitors:new Set(),starts:0,saves:0,shares:0};
    if(r.event_name==="page_view") days[day].visitors.add(r.session_id);
    if(r.event_name==="builder_start") days[day].starts++;
    if(r.event_name==="passport_saved") days[day].saves++;
    if(r.event_name==="share_action") days[day].shares++;
  }
  return NextResponse.json({periodDays:30,visitors,starts,saves,shares,pageViews:count("page_view"),startRate:visitors?starts/visitors:0,saveRate:visitors?saves/visitors:0,shareRate:visitors?shares/visitors:0,daily:Object.entries(days).map(([date,v])=>({date,visitors:v.visitors.size,starts:v.starts,saves:v.saves,shares:v.shares})).sort((a,b)=>b.date.localeCompare(a.date))});
}

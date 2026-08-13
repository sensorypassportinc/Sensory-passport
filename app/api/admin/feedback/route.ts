import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const configuredPassword = process.env.FEEDBACK_ADMIN_PASSWORD;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = "https://jlkcuvwbwyuhrjluadmf.supabase.co";

  if (!configuredPassword || !serviceRoleKey) {
    return NextResponse.json({ error: "Dashboard not configured" }, { status: 503 });
  }

  const { password } = await request.json();
  if (typeof password !== "string" || password !== configuredPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/product_feedback?select=id,role,ease_rating,usefulness_rating,most_helpful,confusing,suggestions,recommend,created_at&order=created_at.desc&limit=200`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Could not load feedback" }, { status: 500 });
  }

  const rows = await res.json();
  const total = rows.length;
  const avgEase = total ? rows.reduce((sum:number,r:any)=>sum+Number(r.ease_rating||0),0)/total : null;
  const avgUsefulness = total ? rows.reduce((sum:number,r:any)=>sum+Number(r.usefulness_rating||0),0)/total : null;
  const recommendations = rows.reduce((acc:any,r:any)=>{ if(r.recommend in acc) acc[r.recommend]++; return acc; }, { yes:0, maybe:0, no:0 });

  return NextResponse.json({ total, avgEase, avgUsefulness, recommendations, rows });
}

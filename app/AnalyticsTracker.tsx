"use client";

import { useEffect, useRef } from "react";

const SUPABASE_URL = "https://jlkcuvwbwyuhrjluadmf.supabase.co";
const SUPABASE_KEY = "sb_publishable_DiYtRDfhYyyv7bRYpNENoQ_wDggJIbv";
const SESSION_KEY = "sensory-passport-analytics-session";
type EventName = "page_view" | "builder_start" | "passport_saved" | "share_action";

function sessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(SESSION_KEY, id); }
  return id;
}

export function trackAnalytics(event_name: EventName) {
  if (typeof window === "undefined") return;
  fetch(`${SUPABASE_URL}/rest/v1/analytics_events`, {
    method: "POST", keepalive: true,
    headers: { "Content-Type":"application/json", apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, Prefer:"return=minimal" },
    body: JSON.stringify({ session_id:sessionId(), event_name, page_path:window.location.pathname }),
  }).catch(()=>{});
}

export default function AnalyticsTracker() {
  const started=useRef(false);
  useEffect(()=>{
    trackAnalytics("page_view");
    const builder=document.getElementById("builder");
    const observer=builder?new IntersectionObserver(entries=>{
      if(!started.current&&entries.some(entry=>entry.isIntersecting)){started.current=true;trackAnalytics("builder_start");observer.disconnect()}
    },{threshold:.2}):null;
    if(builder&&observer)observer.observe(builder);

    const onSubmit=(event:Event)=>{const form=event.target as HTMLFormElement;if(form.closest("#builder"))trackAnalytics("passport_saved")};
    const onClick=(event:MouseEvent)=>{const target=(event.target as HTMLElement).closest("button");if(!target)return;const text=(target.textContent||"").toLowerCase();if(text.includes("share with")||text.includes("email passport")||text.includes("download / save pdf")||text.includes("copy summary"))trackAnalytics("share_action")};
    document.addEventListener("submit",onSubmit,true);document.addEventListener("click",onClick,true);
    return()=>{observer?.disconnect();document.removeEventListener("submit",onSubmit,true);document.removeEventListener("click",onClick,true)};
  },[]);
  return null;
}

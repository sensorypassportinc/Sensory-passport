"use client";

import { useEffect, useRef } from "react";

const SUPABASE_URL = "https://jlkcuvwbwyuhrjluadmf.supabase.co";
const SUPABASE_KEY = "sb_publishable_DiYtRDfhYyyv7bRYpNENoQ_wDggJIbv";
const SESSION_KEY = "sensory-passport-analytics-session";

function sessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function trackAnalytics(event_name: "page_view" | "builder_start" | "passport_saved" | "share_action") {
  if (typeof window === "undefined") return;
  fetch(`${SUPABASE_URL}/rest/v1/analytics_events`, {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ session_id: sessionId(), event_name, page_path: window.location.pathname }),
  }).catch(() => {});
}

export default function AnalyticsTracker() {
  const started = useRef(false);
  useEffect(() => {
    trackAnalytics("page_view");
    const builder = document.getElementById("builder");
    if (!builder) return;
    const observer = new IntersectionObserver(entries => {
      if (!started.current && entries.some(entry => entry.isIntersecting)) {
        started.current = true;
        trackAnalytics("builder_start");
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(builder);
    return () => observer.disconnect();
  }, []);
  return null;
}

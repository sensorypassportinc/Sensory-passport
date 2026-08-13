"use client";

import { useState } from "react";

type DemoRequest={department:string;type:string;location:string;requester:string;title:string;status:"Pending"|"Approved"|"Denied"};
const initial:DemoRequest={department:"Demo County Fire & Rescue",type:"Fire / EMS",location:"Demo City, AL",requester:"Demo Chief",title:"Fire Chief",status:"Pending"};

export default function ResponderAdminPage(){
  const [request,setRequest]=useState(initial);
  return <main style={{maxWidth:820,margin:"0 auto",padding:"40px 22px",fontFamily:"Arial,sans-serif",color:"#17211f"}}>
    <p style={{fontWeight:800,color:"#8b1e2d",letterSpacing:1}}>SENSORY PASSPORT ADMIN</p>
    <h1 style={{fontSize:"clamp(32px,6vw,50px)",marginBottom:8}}>Department Approval</h1>
    <div style={{marginTop:20,padding:16,border:"1px solid #d9b26d",borderRadius:12,background:"#fff9ec"}}><strong>Prototype only:</strong> this screen uses fictional demo information and does not approve real departments yet. Production access will require a verified Sensory Passport platform-admin account.</div>
    <section style={{marginTop:28,padding:22,border:"1px solid #cfd8d5",borderRadius:16}}>
      <p style={{fontWeight:800,color:request.status==="Approved"?"#2b7a4b":request.status==="Denied"?"#8b1e2d":"#775a18"}}>{request.status}</p>
      <h2>{request.department}</h2><p><strong>Agency type:</strong> {request.type}</p><p><strong>Location:</strong> {request.location}</p><p><strong>Requester:</strong> {request.requester}, {request.title}</p>
      <h3 style={{marginTop:24}}>Verification checklist</h3>
      <ul style={{lineHeight:1.8}}><li>Confirm the agency exists through an official government or department source.</li><li>Confirm the requester holds an authorized leadership or administrative role.</li><li>Confirm the official email/domain and contact information belong to the agency.</li><li>Document the verification source and reviewer.</li><li>Do not approve individual responder access automatically with department approval.</li></ul>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:22}}><button onClick={()=>setRequest({...request,status:"Approved"})} style={{...button,background:"#2b7a4b"}}>Approve Demo</button><button onClick={()=>setRequest({...request,status:"Denied"})} style={button}>Deny Demo</button><button onClick={()=>setRequest(initial)} style={{...button,background:"#555"}}>Reset</button></div>
    </section>
    <section style={{marginTop:28,padding:18,borderRadius:14,background:"#f4f5f2"}}><h2>After department approval</h2><p>The approved department leader can be assigned as a department administrator. That administrator may invite or nominate responders, but Sensory Passport verification rules still determine whether each responder account receives portal access.</p></section>
  </main>;
}
const button={padding:"12px 17px",border:0,borderRadius:10,fontWeight:800,background:"#8b1e2d",color:"white",cursor:"pointer"} as const;

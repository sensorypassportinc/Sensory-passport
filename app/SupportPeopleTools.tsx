"use client";

import { useEffect, useState } from "react";

type SupportPerson = { name:string; relationship:string; phone:string; note:string; shareEmergency:boolean };
const emptyPerson: SupportPerson = { name:"", relationship:"", phone:"", note:"", shareEmergency:false };

export default function SupportPeopleTools(){
  const [people,setPeople]=useState<SupportPerson[]>([{...emptyPerson},{...emptyPerson},{...emptyPerson}]);
  const [saved,setSaved]=useState(false);

  useEffect(()=>{
    try{
      const raw=localStorage.getItem("sensory-passport-support-people");
      if(raw){
        const parsed=JSON.parse(raw) as SupportPerson[];
        setPeople([0,1,2].map(i=>({...emptyPerson,...(parsed[i]||{})})));
        return;
      }
      const passportRaw=localStorage.getItem("sensory-passport");
      if(passportRaw){
        const stored=JSON.parse(passportRaw);
        const legacy=(stored.passport??stored)?.contact;
        if(legacy) setPeople([{...emptyPerson,name:String(legacy)}, {...emptyPerson}, {...emptyPerson}]);
      }
    }catch{}
  },[]);

  function update(index:number,key:keyof SupportPerson,value:string|boolean){
    setPeople(current=>current.map((p,i)=>i===index?{...p,[key]:value}:p));
    setSaved(false);
  }
  function save(){
    localStorage.setItem("sensory-passport-support-people",JSON.stringify(people));
    setSaved(true);
  }
  const active=people.filter(p=>p.name||p.relationship||p.phone||p.note);

  return <section id="support-people" style={{maxWidth:980,margin:"0 auto 48px",padding:"0 22px"}}>
    <div style={{padding:24,border:"1px solid #d7dcda",borderRadius:18,background:"white"}}>
      <p style={{fontWeight:800,color:"#177f78",letterSpacing:1,marginBottom:6}}>SUPPORT PEOPLE</p>
      <h2 style={{marginTop:0}}>Add up to three trusted support people</h2>
      <p>These contacts are saved on this device with your passport. Only contacts you mark for emergency sharing will appear in the Emergency / First Responder view. Add someone only with their permission.</p>
      <div style={{display:"grid",gap:16,marginTop:20}}>{people.map((person,index)=><fieldset key={index} style={{border:"1px solid #d7dcda",borderRadius:14,padding:16}}><legend style={{fontWeight:800,padding:"0 6px"}}>Support person {index+1}</legend>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12}}>
          <Field label="Name"><input value={person.name} onChange={e=>update(index,"name",e.target.value)} style={field}/></Field>
          <Field label="Relationship"><input placeholder="Parent, grandparent, therapist…" value={person.relationship} onChange={e=>update(index,"relationship",e.target.value)} style={field}/></Field>
          <Field label="Phone"><input type="tel" value={person.phone} onChange={e=>update(index,"phone",e.target.value)} style={field}/></Field>
          <Field label="Optional note"><input placeholder="Primary contact, call first…" value={person.note} onChange={e=>update(index,"note",e.target.value)} style={field}/></Field>
        </div>
        <label style={{display:"flex",gap:9,alignItems:"flex-start",marginTop:12}}><input type="checkbox" checked={person.shareEmergency} onChange={e=>update(index,"shareEmergency",e.target.checked)}/><span>Show this person in the Emergency / First Responder view.</span></label>
      </fieldset>)}</div>
      <button type="button" onClick={save} style={{marginTop:18,padding:"12px 18px",border:0,borderRadius:10,fontWeight:800,background:"#177f78",color:"white"}}>Save support people</button>{saved&&<span style={{marginLeft:12,fontWeight:700}}>✓ Saved</span>}
    </div>
    <section className="printSupportPeople" style={{marginTop:18,padding:18,border:"1px solid #d7dcda",borderRadius:14}}><strong>Support people</strong>{active.length?<ol>{active.map((p,i)=><li key={i} style={{marginTop:8}}>{[p.name,p.relationship,p.phone,p.note].filter(Boolean).join(" • ")}</li>)}</ol>:<p>Not provided</p>}</section>
  </section>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label style={{fontWeight:700}}>{label}{children}</label>}
const field={display:"block",width:"100%",marginTop:6,padding:10,borderRadius:9,border:"1px solid #aaa",font:"inherit"} as const;

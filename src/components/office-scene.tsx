import { useState } from 'react';
import { Maximize, Minus, Plus, Users, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import officeImage from '@/assets/office.jpg';
import type { Agent } from '@/lib/office-context';
export function Person({index=0}:{index?:number}) {
 return <svg viewBox="0 0 44 66" className={`person person-${index%6}`} aria-hidden="true"><ellipse className="person-shadow" cx="22" cy="61" rx="14" ry="4"/><path className="person-pants" d="M14 38h16l-1 21h-7l-1-15-2 15h-7z"/><path className="person-shirt" d="M13 23q9-5 18 0l5 17-7 2-2-11v15H15V31l-3 11-7-3z"/><rect className="person-skin" x="18" y="17" width="8" height="9" rx="3"/><ellipse className="person-skin" cx="22" cy="13" rx="9" ry="11"/><path className="person-hair" d="M12 13V7q2-8 13-6 9 2 7 12l-4-5-9 1-6 7z"/><path className="person-shoes" d="M12 57h7v5H9q-2-4 3-5m11 0h7l4 4H23z"/></svg>;
}
export function OfficeScene({agents,demo,onSelect,paused}:{agents:Agent[];demo:boolean;onSelect:(agent:Agent)=>void;paused:boolean}) {
 const [zoom,setZoom]=useState(100);
 const [people,setPeople]=useState(true);
 const names=['Meeting room','Owner’s office','Engineering','The lounge','Coffee corner','Growth studio'];
 return <section className={`office-scene ${paused?'office-paused':''}`}>
   <div className="scene-top"><span className="floor-label"><span className="small-dot"/> HQ · Floor 01</span><span className="scene-presence">{demo?'Office preview':paused?'Office paused':'Your workspace'} <span className="presence-dot"/></span></div>
   <div className="scene-canvas" data-zoom={zoom}>
     <img src={officeImage} alt="Cutaway headquarters with meeting room, owner’s office, engineering desks, lounge, coffee corner, and growth studio" width={1536} height={1024}/>
     {names.map((name,i)=><div className={`room-label room-${i}`} key={name}>{i===4 && <Coffee size={11}/>} {name}</div>)}
     {people && agents.slice(0,10).map((agent,i)=><Button variant="ghost" key={agent.id} className={`office-agent agent-position-${i%10}`} onClick={()=>onSelect(agent)} aria-label={`Open ${agent.name} profile`}><Person index={i}/><span className="agent-name">{agent.name.split(' ')[0]} <span className={agent.status==='paused'?'status-dot paused-dot':'status-dot'}/></span></Button>)}
   </div>
   <div className="scene-bottom"><span><span className="legend-dot"/> {demo?'Illustrative avatars · no work running':'Avatar presence · task status in profiles'}</span><div className="scene-tools"><Button variant="ghost" size="icon" title="Show or hide people" onClick={()=>setPeople(!people)} aria-pressed={people}><Users/></Button><span className="tool-separator"/><Button variant="ghost" size="icon" title="Zoom out" onClick={()=>setZoom(Math.max(80,zoom-10))}><Minus/></Button><span>{zoom}%</span><Button variant="ghost" size="icon" title="Zoom in" onClick={()=>setZoom(Math.min(120,zoom+10))}><Plus/></Button><Button variant="ghost" size="icon" title="Reset office view" onClick={()=>setZoom(100)}><Maximize/></Button></div></div>
 </section>;
}
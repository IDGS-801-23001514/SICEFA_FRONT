import React, { useEffect, useMemo, useState } from 'react'
import { Eye, Pencil, Plus, Trash2, MapPin } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {api,toQuery,money,birthDate} from '../lib/api'
import {PageHeader,Panel,Alert,DataTable,SearchBar,Status,Modal,Loading} from '../components/Interface'
import {config} from './resourceConfig'

const camel = s => s.replace(/_([a-z])/g,(_,a)=>a.toUpperCase())
function FormControl({field,value,onChange,disabled}){
 const common={id:'f-'+field.key,disabled,required:field.required&&!disabled,value:value??'',onChange:e=>onChange(field.key,e.target.value)}
 if(field.type==='textarea')return <textarea {...common} rows={3} placeholder={field.label}/>
 if(field.type==='select')return <select {...common}><option value="">Selecciona una opción</option>{field.options.map(([v,t])=><option value={v} key={v}>{t}</option>)}</select>
 if(field.type==='image')return <div className="photo-upload"><input id={common.id} disabled={disabled} type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>800000) {alert('La imagen debe ser menor de 800 KB.');return}const reader=new FileReader();reader.onload=()=>onChange(field.key,reader.result);reader.readAsDataURL(f)}}/>{value&&value.startsWith('data:image')&&<img src={value} alt="Vista previa"/>}<small>Formato PNG/JPG/WebP, máximo 800 KB</small></div>
 return <input {...common} type={field.type||'text'} min={field.min} step={field.step} placeholder={field.label}/>
}
function Detail({type,row,onClose}){
 const cfg=config[type],lat=parseFloat(row.latitud),lon=parseFloat(row.longitud),valid=Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180
 const bbox=valid?[lon-.006,lat-.004,lon+.006,lat+.004].join(','):''
 return <Modal title={type==='sucursales'?'Detalle de sucursal':'Detalle del registro'} subtitle="Información almacenada en la base de datos" onClose={onClose} wide><div className="detail-grid">{cfg.fields.filter(f=>f.type!=='image').map(f=><div className="detail-field" key={f.key}><small>{f.label}</small><strong>{f.key==='fecha_nacimiento'?birthDate(row[camel(f.key)]):String(row[camel(f.key)]??'—')}</strong></div>)}</div>{type==='sucursales'&&<div className="map-card"><h3><MapPin size={17}/> Geolocalización</h3>{valid?<iframe title="Mapa de la sucursal" loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lon}`}/>:<p>Registra latitud y longitud en los datos de la sucursal para mostrar su ubicación.</p>}</div>}<div className="modal-actions"><button className="btn btn-outline" onClick={onClose}>Cerrar</button></div></Modal>
}
export default function ResourcePage({type}){
 const cfg=config[type],{user}=useAuth(),readonly=type==='productos'&&user.codigoRol!=='ADMC';
 const [rows,setRows]=useState([]),[search,setSearch]=useState(''),[estatus,setEstatus]=useState('1'),[busy,setBusy]=useState(true),[notice,setNotice]=useState(''),[error,setError]=useState(''),[edit,setEdit]=useState(null),[detail,setDetail]=useState(null),[form,setForm]=useState({}),[saving,setSaving]=useState(false)
 const load=async()=>{setBusy(true);setError('');try{const data=await api('/'+type+toQuery({q:search,estatus:readonly?undefined:estatus}));setRows(data)}catch(e){setError(e.message)}finally{setBusy(false)}}
 useEffect(()=>{const timer=setTimeout(load,250);return()=>clearTimeout(timer)},[type,search,estatus])
 const openForm=(row=null)=>{setEdit(row||'new');setNotice('');setForm(row?Object.fromEntries(cfg.fields.map(f=>[f.key,row[camel(f.key)]==null?'':f.type==='date'?String(row[camel(f.key)]).slice(0,10):String(row[camel(f.key)])])):{estatus:'1',codigo_rol:'EMPS',puesto:'Atención a Clientes',fecha_ingreso:new Date().toISOString().slice(0,10)});}
 const save=async e=>{e.preventDefault();setSaving(true);setError('');try{
  const body={...form};if(edit!=='new'){for(const f of cfg.fields)if(f.immutable)delete body[f.key];}
  const result=await api('/'+type+(edit==='new'?'':'/'+edit[cfg.id]),{method:edit==='new'?'POST':'PUT',body});
  setEdit(null);setNotice(result?.claveTemporal?`Empleado creado. Usuario: ${result.codigoEmpleado}; contraseña temporal: ${result.claveTemporal}`:result?.registro?.usuarioGenerado?`Sucursal creada; administrador: ${result.registro.usuarioGenerado}. Contraseña temporal igual al usuario.`:'Registro guardado correctamente.');await load()
 }catch(e){setError(e.message)}finally{setSaving(false)}}
 const remove=async row=>{if(!window.confirm(`¿Desactivar ${row.nombre||row.codigoEmpleado}? La baja será lógica.`))return;try{await api('/'+type+'/'+row[cfg.id],{method:'DELETE'});setNotice('El registro se desactivó sin eliminar su historial.');await load()}catch(e){setError(e.message)}}
 const columns=useMemo(()=>cfg.columns.map(([key,label])=>({key,label,render:key==='estatus'?v=><Status value={v}/>:key==='precioUnitario'?money:key==='fechaNacimiento'?birthDate:undefined})),[type]);
 return <><PageHeader eyebrow={`SICEFA ${user.codigoRol==='ADMC'?'CENTRAL':'SUCURSAL'} / CATÁLOGOS`} title={cfg.title} description={cfg.description} action={readonly?undefined:cfg.action} onAction={()=>openForm()}/>{error&&<Alert onClose={()=>setError('')}>{error}</Alert>}{notice&&<Alert type="success" onClose={()=>setNotice('')}>{notice}</Alert>}
 <Panel><SearchBar rows={rows} search={search} setSearch={setSearch} estatus={estatus} setEstatus={readonly?undefined:setEstatus} file={`sicefa-${type}.csv`} refresh={load}/>{busy?<Loading/>:<DataTable columns={columns} rows={rows} onRow={setDetail} actions={r=><><button title="Ver detalle" className="action-icon" onClick={()=>setDetail(r)}><Eye size={17}/></button>{!readonly&&<><button className="action-icon" title="Editar" onClick={()=>openForm(r)}><Pencil size={17}/></button>{r[cfg.id]!==1||type==='productos'?<button className="action-icon danger" title="Desactivar" onClick={()=>remove(r)}><Trash2 size={17}/></button>:null}</>}</>} empty="No hay registros. Puedes crear uno con el botón superior."/>}</Panel><div className="info-strip">{cfg.note}</div>
 {detail&&<Detail type={type} row={detail} onClose={()=>setDetail(null)}/>} {edit&&<Modal wide title={edit==='new'?cfg.action:'Editar '+cfg.title.toLowerCase()} subtitle="Los campos identificadores están protegidos por las reglas de la base de datos." onClose={()=>setEdit(null)}><form onSubmit={save} className="resource-form"><div className="form-grid">{cfg.fields.filter(f=>(edit==='new'&&f.key!=='estatus')||(edit!=='new'&&!f.immutable)).map(f=><label key={f.key} className={'form-field '+(f.type==='textarea'||f.type==='image'?'form-wide':'')} htmlFor={'f-'+f.key}>{f.label}{f.required&&<span className="required"> *</span>}<FormControl field={f} value={form[f.key]} onChange={(k,v)=>setForm(p=>({...p,[k]:v}))} disabled={false}/></label>)}</div><div className="modal-actions"><button type="button" className="btn btn-outline" onClick={()=>setEdit(null)}>Cancelar</button><button disabled={saving} className="btn btn-primary" type="submit"><Plus size={17}/>{saving?'Guardando...':'Guardar registro'}</button></div></form></Modal>}
 </>
}

import React from 'react'
import { AlertCircle, CheckCircle2, FileDown, Plus, RefreshCw, Search, X } from 'lucide-react'
import { exportCsv } from '../lib/api'

export function PageHeader({eyebrow,title,description,action,onAction,icon:Icon=Plus}) {
 return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action&&<button className="btn btn-primary" onClick={onAction}><Icon size={17}/>{action}</button>}</div>
}
export function Panel({title,children,action,className=''}) {return <section className={'panel '+className}>{title&&<div className="panel-heading"><h2>{title}</h2>{action}</div>}{children}</section>}
export function Loading(){return <div className="loading-state"><RefreshCw className="spin" size={23}/><span>Cargando información de SICEFA...</span></div>}
export function Empty({message='No se encontraron registros.'}) {return <div className="empty"><Search size={27}/><strong>Sin resultados</strong><span>{message}</span></div>}
export function Alert({type='error',children,onClose}){return <div className={'alert alert-'+type}>{type==='success'?<CheckCircle2 size={19}/>:<AlertCircle size={19}/>}<span>{children}</span>{onClose&&<button aria-label="Cerrar aviso" onClick={onClose}><X size={16}/></button>}</div>}
export function Status({value}){
 const ok=String(value)==='1'||value==='ACTIVA'||value==='ATENDIDA'
 const bad=String(value)==='0'||value==='CANCELADA'||value==='ELIMINADA'
 const label={1:'Activo',0:'Inactivo',ACTIVA:'Activa',ATENDIDA:'Atendida',PENDIENTE:'Pendiente',CANCELADA:'Cancelada',ELIMINADA:'Eliminada'}[value]||value||'—'
 return <span className={'status '+(ok?'status-good':bad?'status-bad':'status-warn')}>{label}</span>
}
export function SearchBar({search,setSearch,estatus,setEstatus,options=['1','0'],rows=[],file='reporte.csv',refresh}) {
 return <div className="toolbar"><label className="search"><Search size={18}/><input aria-label="Buscar" placeholder="Buscar en los registros..." value={search} onChange={e=>setSearch(e.target.value)}/></label>{setEstatus&&<select value={estatus} onChange={e=>setEstatus(e.target.value)} aria-label="Filtrar por estado"><option value="">Todos los estados</option>{options.map(x=><option key={x} value={x}>{({1:'Activos',0:'Inactivos',PENDIENTE:'Pendientes',ATENDIDA:'Atendidos',CANCELADA:'Cancelados',ELIMINADA:'Eliminados',ACTIVA:'Activas'})[x]||x}</option>)}</select>}{refresh&&<button className="btn btn-outline" onClick={refresh}><RefreshCw size={16}/>Actualizar</button>}<button className="btn btn-outline" onClick={()=>exportCsv(rows,file)} disabled={!rows.length}><FileDown size={17}/>Exportar CSV</button></div>
}
export function DataTable({columns,rows,onRow,actions,empty='No hay registros para mostrar.'}){
 if(!rows?.length)return <Empty message={empty}/>
 return <div className="table-scroll"><table><thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}{actions&&<th>Acciones</th>}</tr></thead><tbody>{rows.map((row,i)=><tr key={row.id||row.idProducto||row.idSucursal||row.idVenta||row.idPedido||row.idEmpleado||row.idCliente||i} onClick={()=>onRow?.(row)} className={onRow?'click-row':''}>{columns.map(c=><td key={c.key}>{c.render?c.render(row[c.key],row):row[c.key]??'—'}</td>)}{actions&&<td onClick={e=>e.stopPropagation()}><div className="row-actions">{actions(row)}</div></td>}</tr>)}</tbody></table></div>
}
export function Modal({title,subtitle,children,onClose,wide=false}) {
 return <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className={'modal '+(wide?'modal-wide':'')} role="dialog" aria-modal="true" aria-label={title}><header className="modal-header"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button className="icon-btn" onClick={onClose} aria-label="Cerrar"><X size={21}/></button></header>{children}</section></div>
}
export const humanRole={ADMC:'Administrador Central',ADMS:'Administrador de Sucursal',EMPS:'Empleado de Sucursal'}

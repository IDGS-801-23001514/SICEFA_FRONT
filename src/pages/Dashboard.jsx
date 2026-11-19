import React,{useEffect,useState} from 'react'
import { Building2, ClipboardCheck, ClipboardList, Package, Pill, ShoppingCart, TrendingUp, Wallet } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api, dateTime, money } from '../lib/api'
import {PageHeader,Panel,Loading,Alert,Status,DataTable} from '../components/Interface'

export default function Dashboard(){
 const {user}=useAuth();const central=user.codigoRol==='ADMC';const [data,setData]=useState(null);const [error,setError]=useState('')
 useEffect(()=>{api('/dashboard').then(setData).catch(e=>setError(e.message))},[])
 const m=data?.metrics||{}
 const cards=central?[
  {name:'Sucursales activas',value:m.sucursales??0,Icon:Building2,help:'Sucursales operativas'},
  {name:'Medicamentos',value:m.productos??0,Icon:Pill,help:'Catálogo general activo'},
  {name:'Pedidos pendientes',value:m.pedidosPendientes??0,Icon:ClipboardList,help:'Solicitudes por atender'},
  {name:'Pedidos atendidos',value:m.pedidosAtendidos??0,Icon:ClipboardCheck,help:'Solicitudes surtidas'}
 ]:[
  {name:'Ventas activas',value:m.ventas??0,Icon:ShoppingCart,help:'Transacciones de esta sucursal'},
  {name:'Ingresos registrados',value:money(m.ingresos),Icon:Wallet,help:'Importe de ventas activas'},
  {name:'Pedidos pendientes',value:m.pedidosPendientes??0,Icon:ClipboardList,help:'Solicitudes por atender'},
  {name:'Productos con stock',value:m.productosConStock??0,Icon:Package,help:'Medicamentos disponibles'}
 ];const trend=data?.trend||[];const max=Math.max(1,...trend.map(x=>Number(x.total)||0))
 return <><PageHeader eyebrow={central?'SICEFA CENTRAL / INICIO':'SICEFA SUCURSAL / INICIO'} title={central?'Resumen general':'Resumen de sucursal'} description={central?'Estado general de sucursales, medicamentos y pedidos.':`Actividad y resultados de ${user.sucursal}.`}/>{error&&<Alert>{error}</Alert>}{!data?<Loading/>:<>
 <section className="metric-grid">{cards.map(({name,value,Icon,help})=><article className="metric-card" key={name}><div className="metric-header"><span>{name}</span><Icon size={19}/></div><div className="metric-value">{value}</div><p>{help}</p></article>)}</section>
 <div className="dashboard-layout"><Panel title={central?'Pedidos por mes':'Ingresos por mes'} className="chart-panel"><div className="chart-subtitle">Indicadores calculados desde MySQL · últimos 6 meses</div>{trend.length?<div className="bar-chart">{trend.map((x,i)=><div className="bar-column" key={x.periodo}><div title={`${x.periodo}: ${central?x.total:money(x.total)}`} className={'bar '+(i===trend.length-1?'bar-strong':'')} style={{height:`${Math.max(4,Number(x.total)*100/max)}%`}}/><span>{x.periodo?.slice(5)}</span></div>)}</div>:<div className="chart-empty"><TrendingUp size={28}/>Aún no hay movimientos en este periodo.</div>}</Panel>
 <Panel title={central?'Estado de la matriz':'Información de la sucursal'} className="summary-card"><div className="summary-row"><span>Sistema</span><strong>{central?'SICEFA Central':'SICEFA Sucursal'}</strong></div><div className="summary-row"><span>Sucursal</span><strong>{user.sucursal}</strong></div><div className="summary-row"><span>Rol</span><strong>{user.codigoRol}</strong></div><div className="summary-row"><span>Código de empleado</span><strong>{user.codigoEmpleado}</strong></div><div className="summary-notice"><ClipboardCheck size={18}/>Los indicadores corresponden únicamente a registros almacenados en la base de datos.</div></Panel></div>
 <Panel title={central?'Últimos pedidos de compra':'Últimas ventas'}><DataTable rows={data.latest||[]} columns={central?[{key:'idPedido',label:'Folio'},{key:'sucursal',label:'Sucursal'},{key:'empleado',label:'Solicitado por'},{key:'fechaPedido',label:'Fecha',render:dateTime},{key:'totalPedido',label:'Total',render:money},{key:'estatus',label:'Estado',render:x=><Status value={x}/>}]:[{key:'idVenta',label:'Folio'},{key:'cliente',label:'Cliente'},{key:'empleado',label:'Empleado'},{key:'fechaVenta',label:'Fecha',render:dateTime},{key:'totalVenta',label:'Importe',render:money},{key:'estatus',label:'Estado',render:x=><Status value={x}/>}]} empty="Los movimientos aparecerán aquí cuando registres operaciones."/></Panel></>}</>
}

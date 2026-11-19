import React,{useEffect,useState} from 'react'
import {BarChart3,ClipboardList,FileDown,Package,ShoppingCart} from 'lucide-react'
import {useAuth} from '../contexts/AuthContext'
import {api,toQuery,dateTime,money,exportCsv} from '../lib/api'
import {PageHeader,Panel,DataTable,Loading,Alert,Status} from '../components/Interface'
export default function Reports(){
 const {user}=useAuth(),central=user.codigoRol==='ADMC';const [tab,setTab]=useState('pedidos'),[rows,setRows]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[from,setFrom]=useState(''),[to,setTo]=useState('')
 const types=central?[['pedidos','Pedidos de compra',ClipboardList]]:[['ventas','Ventas',ShoppingCart],['pedidos','Pedidos de compra',ClipboardList],['existencias','Existencias',Package]]
 useEffect(()=>{setTab('pedidos')},[central])
 const load=async()=>{setLoading(true);try{setRows(await api('/reportes/'+tab));setError('')}catch(e){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[tab])
 const filtered=rows.filter(x=>{const d=x.fechaVenta||x.fechaPedido;return !d||((!from||d.slice(0,10)>=from)&&(!to||d.slice(0,10)<=to))})
 const cols=tab==='pedidos'?[{key:'idPedido',label:'Folio'},{key:'fechaPedido',label:'Fecha',render:dateTime},{key:'sucursal',label:'Sucursal'},{key:'empleado',label:'Empleado'},{key:'codigoPostal',label:'C.P.'},{key:'ciudad',label:'Ciudad'},{key:'estado',label:'Estado'},{key:'totalPedido',label:'Total',render:money},{key:'estatus',label:'Estado',render:v=><Status value={v}/>}]:tab==='ventas'?[{key:'idVenta',label:'Folio'},{key:'fechaVenta',label:'Fecha',render:dateTime},{key:'cliente',label:'Cliente'},{key:'empleado',label:'Empleado'},{key:'totalVenta',label:'Total',render:money},{key:'estatus',label:'Estado',render:v=><Status value={v}/>}]:[{key:'producto',label:'Producto'},{key:'nombreGenerico',label:'Nombre genérico'},{key:'codigoBarras',label:'Código'},{key:'precioUnitario',label:'Precio',render:money},{key:'existencia',label:'Existencia'}]
 return <><PageHeader eyebrow={`SICEFA ${central?'CENTRAL':'SUCURSAL'} / REPORTES`} title="Reportes operativos" description="Consulta información del sistema, aplica filtros de fecha y exporta datos para su revisión."/>{error&&<Alert>{error}</Alert>}
 <section className="report-types">{types.map(([key,label,Icon])=><button key={key} className={'report-tile '+(tab===key?'report-selected':'')} onClick={()=>{setTab(key);setFrom('');setTo('')}}><Icon size={23}/><span>{label}</span><small>Consultar reporte</small></button>)}</section>
 <Panel title={types.find(x=>x[0]===tab)?.[1]}><div className="report-controls">{tab!=='existencias'&&<><label>Desde<input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label><label>Hasta<input type="date" value={to} onChange={e=>setTo(e.target.value)}/></label></>}<button className="btn btn-outline" disabled={!filtered.length} onClick={()=>exportCsv(filtered,`sicefa-reporte-${tab}.csv`)}><FileDown size={17}/>Exportar CSV</button></div>{loading?<Loading/>:<DataTable rows={filtered} columns={cols} empty="No se encontraron movimientos en el periodo seleccionado."/>}</Panel><div className="info-strip">Los reportes de sucursal muestran únicamente los datos de la sucursal asignada al usuario.</div></>
}

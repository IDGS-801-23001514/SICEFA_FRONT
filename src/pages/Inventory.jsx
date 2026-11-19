import React,{useEffect,useState} from 'react'
import { Package, PackageCheck, PackageX } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api, money, toQuery } from '../lib/api'
import {PageHeader,Panel,DataTable,SearchBar,Loading,Alert} from '../components/Interface'
export default function Inventory(){
 const {user}=useAuth(),[rows,setRows]=useState([]),[search,setSearch]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState('')
 const load=async()=>{setLoading(true);try{setRows(await api('/inventario'+toQuery({q:search})));setError('')}catch(e){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{const t=setTimeout(load,240);return()=>clearTimeout(t)},[search])
 const stock=rows.reduce((s,x)=>s+Number(x.existencia||0),0),available=rows.filter(r=>Number(r.existencia)>0).length
 return <><PageHeader eyebrow="SICEFA SUCURSAL / INVENTARIO" title="Existencias de medicamentos" description={`Inventario de ${user.sucursal}. Se actualiza con pedidos atendidos y ventas registradas.`}/>{error&&<Alert>{error}</Alert>}<div className="metric-grid metric-three"><div className="metric-card"><div className="metric-header">Medicamentos en catálogo <Package size={19}/></div><div className="metric-value">{rows.length}</div><p>Medicamentos activos</p></div><div className="metric-card"><div className="metric-header">Productos disponibles <PackageCheck size={19}/></div><div className="metric-value">{available}</div><p>Con existencia mayor a cero</p></div><div className="metric-card"><div className="metric-header">Unidades registradas <PackageX size={19}/></div><div className="metric-value">{stock}</div><p>Stock total de la sucursal</p></div></div><Panel><SearchBar rows={rows} search={search} setSearch={setSearch} file="existencias-sucursal.csv" refresh={load}/>{loading?<Loading/>:<DataTable rows={rows} columns={[{key:'idProducto',label:'ID'},{key:'producto',label:'Medicamento'},{key:'nombreGenerico',label:'Nombre genérico'},{key:'codigoBarras',label:'Código de barras'},{key:'precioUnitario',label:'Precio',render:money},{key:'existencia',label:'Existencia',render:v=><strong className={Number(v)===0?'qty-zero':'qty-good'}>{v}</strong>}]} empty="No hay medicamentos activos que coincidan con la búsqueda."/>}</Panel></>
}

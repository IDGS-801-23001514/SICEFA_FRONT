import React, {useState} from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Building2, ClipboardList, LayoutDashboard, Pill, ShoppingCart, Users, UserRound, Package, ChartNoAxesCombined, LockKeyhole, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import {useAuth} from '../contexts/AuthContext'
import {humanRole} from './Interface'

const links={
 ADMC:[['/','Resumen general',LayoutDashboard],['/sucursales','Sucursales',Building2],['/productos','Medicamentos',Pill],['/pedidos','Pedidos de compra',ClipboardList],['/reportes','Reportes',ChartNoAxesCombined]],
 ADMS:[['/','Resumen',LayoutDashboard],['/ventas','Ventas',ShoppingCart],['/pedidos','Pedidos de compra',ClipboardList],['/productos','Medicamentos',Pill],['/inventario','Inventario',Package],['/clientes','Clientes',Users],['/empleados','Empleados',UserRound],['/reportes','Reportes',ChartNoAxesCombined]],
 EMPS:[['/ventas','Ventas',ShoppingCart],['/productos','Medicamentos',Pill]]
}
export default function AppLayout(){
 const {user,logout}=useAuth();const navigate=useNavigate();const location=useLocation();const [open,setOpen]=useState(false);
 const doLogout=async()=>{await logout();navigate('/acceso',{replace:true})}
 return <div className="app-shell">
 <aside className={'sidebar '+(open?'sidebar-open':'')}><div className="brand"><div className="brand-symbol">S</div><div><strong>SICEFA</strong><small>MEDICAMOS TU VIDA</small></div><button className="mobile-close icon-btn" onClick={()=>setOpen(false)}><X size={21}/></button></div>
  <div className="sidebar-section">{user.codigoRol==='ADMC'?'ADMINISTRACIÓN CENTRAL':user.codigoRol==='ADMS'?'OPERACIÓN DE SUCURSAL':'ATENCIÓN A CLIENTES'}</div>
  <nav aria-label="Navegación principal">{(links[user.codigoRol]||[]).map(([path,title,Icon])=><NavLink key={path} to={path} end={path==='/'} onClick={()=>setOpen(false)} className={({isActive})=>'side-link '+(isActive?'active':'')}><Icon size={19}/>{title}</NavLink>)}</nav>
  <div className="side-bottom"><NavLink to="/cuenta" onClick={()=>setOpen(false)} className={({isActive})=>'side-link '+(isActive?'active':'')}><LockKeyhole size={19}/>Mi cuenta</NavLink><button onClick={doLogout} className="side-link side-button"><LogOut size={19}/>Cerrar sesión</button><div className="profile-box"><span className="avatar">{user.nombre?.slice(0,1)||'S'}</span><div><strong>{user.nombre} {user.apellidoPaterno||''}</strong><small>{user.codigoEmpleado} · {user.codigoRol}</small></div></div></div>
 </aside>
 <div className="work-area"><header className="topbar"><button className="icon-btn hamburger" aria-label="Abrir navegación" onClick={()=>setOpen(true)}><Menu size={23}/></button><div className="topbar-title"><span>Medicamos tu Vida</span><b>{user.codigoRol==='ADMC'?'SICEFA Central':'SICEFA Sucursal'} <ChevronDown size={14}/></b></div><div className="topbar-user"><span className="live-dot"/> {user.sucursal} <span className="topbar-divider"/>{humanRole[user.codigoRol]}</div></header>
 <main className="page" key={location.pathname}><Outlet/></main>
 <footer className="app-footer">SICEFA · Sistema interno de farmacias <span>Sesión protegida · {user.sucursal}</span></footer></div>
 {open&&<div className="mobile-overlay" onClick={()=>setOpen(false)}/>}</div>
}

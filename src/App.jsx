import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { WifiOff, RefreshCw } from 'lucide-react'
import { useAuth } from './contexts/AuthContext'
import {Loading} from './components/Interface'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ResourcePage from './pages/ResourcePage'
import Orders from './pages/Orders'
import Sales from './pages/Sales'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'
import Account from './pages/Account'

function ConnectionLost(){const {refresh}=useAuth();return <div className="offline-screen"><WifiOff size={34}/><h2>Sin conexión con SICEFA</h2><p>La sesión no se ha cerrado. Cuando regreses a estar en línea podrás continuar.</p><button className="btn btn-primary" onClick={refresh}><RefreshCw size={17}/>Reintentar conexión</button></div>}
function Gate({children}){
 const {user,loading,offline}=useAuth()
 if(loading)return <div className="fullscreen-loading"><Loading/></div>
 if(!user)return offline?<ConnectionLost/>:<Navigate to="/acceso" replace/>
 if(user.debeCambiarPassword===1||user.debeCambiarPassword===true)return <Navigate to="/cuenta" replace/>
 return children
}
function ProtectedLayout(){const {user,loading,offline}=useAuth();if(loading)return <Loading/>;if(!user)return offline?<ConnectionLost/>:<Navigate to="/acceso" replace/>;return <AppLayout/>}
function Guard({roles,children}){const {user}=useAuth();return roles.includes(user?.codigoRol)?children:<Navigate to="/" replace/>}
function Home(){const {user}=useAuth();return user?.codigoRol==='EMPS'?<Navigate to="/ventas" replace/>:<Dashboard/>}
function LoginRoute(){const {user,loading,offline}=useAuth();if(loading)return <Loading/>;if(offline&&!user)return <ConnectionLost/>;return user?<Navigate to="/" replace/>:<Login/>}
export default function App(){return <Routes>
 <Route path="/acceso" element={<LoginRoute/>}/>
 <Route element={<ProtectedLayout/>}>
  <Route path="/cuenta" element={<Account/>}/>
  <Route path="/" element={<Gate><Home/></Gate>}/>
  <Route path="/sucursales" element={<Gate><Guard roles={['ADMC']}><ResourcePage type="sucursales"/></Guard></Gate>}/>
  <Route path="/productos" element={<Gate><ResourcePage type="productos"/></Gate>}/>
  <Route path="/pedidos" element={<Gate><Guard roles={['ADMC','ADMS']}><Orders/></Guard></Gate>}/>
  <Route path="/ventas" element={<Gate><Guard roles={['ADMS','EMPS']}><Sales/></Guard></Gate>}/>
  <Route path="/inventario" element={<Gate><Guard roles={['ADMS']}><Inventory/></Guard></Gate>}/>
  <Route path="/clientes" element={<Gate><Guard roles={['ADMS']}><ResourcePage type="clientes"/></Guard></Gate>}/>
  <Route path="/empleados" element={<Gate><Guard roles={['ADMS']}><ResourcePage type="empleados"/></Guard></Gate>}/>
  <Route path="/reportes" element={<Gate><Guard roles={['ADMC','ADMS']}><Reports/></Guard></Gate>}/>
 </Route>
 <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes>}

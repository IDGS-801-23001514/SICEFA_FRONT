import React,{useEffect,useState} from 'react'
import { Plus, Minus, Trash2 } from 'lucide-react'
import {api,money} from '../lib/api'
import {Loading} from './Interface'
export default function ItemPicker({items,setItems,sale}){
 const [products,setProducts]=useState([]),[loading,setLoading]=useState(true),[selection,setSelection]=useState(''),[quantity,setQuantity]=useState(1),[error,setError]=useState('')
 useEffect(()=>{api('/productos').then(setProducts).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[])
 const add=()=>{const p=products.find(x=>String(x.idProducto)===selection);if(!p)return;const qty=Number(quantity);if(!Number.isInteger(qty)||qty<1){setError('La cantidad debe ser un entero positivo');return}
 if(sale&&qty>Number(p.existencia||0)){setError('No hay existencias suficientes en esta sucursal');return}
 if(items.some(x=>x.id_producto===p.idProducto)){setError('Este medicamento ya está incluido');return}
 setItems([...items,{id_producto:p.idProducto,cantidad:qty,nombre:p.nombre,precio:p.precioUnitario,stock:p.existencia}]);setError('');setSelection('');setQuantity(1)}
 const total=items.reduce((sum,x)=>sum+Number(x.precio||0)*Number(x.cantidad),0)
 return <div className="item-picker"><h3>Medicamentos incluidos</h3>{error&&<div className="inline-error">{error}</div>}{loading?<Loading/>:<div className="item-add"><label>Medicamento<select value={selection} onChange={e=>setSelection(e.target.value)}><option value="">Selecciona un medicamento</option>{products.filter(x=>!sale||Number(x.existencia)>0).map(x=><option key={x.idProducto} value={x.idProducto}>{x.nombre} · {money(x.precioUnitario)}{sale?` · Stock: ${x.existencia}`:''}</option>)}</select></label><label>Cantidad<input min="1" max="100000" type="number" value={quantity} onChange={e=>setQuantity(e.target.value)}/></label><button type="button" className="btn btn-outline" onClick={add}><Plus size={17}/>Agregar</button></div>}
 <div className="table-scroll"><table><thead><tr><th>Medicamento</th><th>Precio unitario</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead><tbody>{items.length?items.map(x=><tr key={x.id_producto}><td>{x.nombre}</td><td>{money(x.precio)}</td><td>{x.cantidad}</td><td>{money(Number(x.precio)*x.cantidad)}</td><td><button type="button" title="Eliminar producto" className="action-icon danger" onClick={()=>setItems(items.filter(y=>y.id_producto!==x.id_producto))}><Trash2 size={17}/></button></td></tr>):<tr><td colSpan={5} className="empty-row">Aún no has agregado medicamentos.</td></tr>}</tbody></table></div><div className="total-line">Total estimado <strong>{money(total)}</strong></div><div className="field-hint">El servidor toma los precios vigentes directamente de MySQL y conserva el precio histórico de la operación.</div></div>
}

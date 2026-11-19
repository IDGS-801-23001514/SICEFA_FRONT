const root = import.meta.env.VITE_API_URL || '/api'

export async function api(path, { method = 'GET', body, ...options } = {}) {
  let response
  try {
    response = await fetch(root + path, {
      ...options,
      method,
      credentials: 'include',
      headers: { 'X-SICEFA-Request': 'web', ...(body !== undefined ? {'Content-Type': 'application/json'} : {}), ...options.headers },
      body: body !== undefined ? JSON.stringify(body) : undefined
    })
  } catch {
    throw new Error('No se pudo contactar con la API. Verifica que el backend .NET esté ejecutándose en el puerto 5086.')
  }
  if (!response.ok) {
    let data = {}
    try { data = await response.json() } catch { /* error vacío */ }
    if (response.status === 401 && path !== '/auth/me' && path !== '/auth/login')
      window.dispatchEvent(new Event('sicefa-unauthorized'))
    throw new Error(data.error || `Error HTTP ${response.status}`)
  }
  if (response.status === 204) return null
  return response.json()
}
export function toQuery(data) {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(data)) if (v !== undefined && v !== null && v !== '') params.set(k, String(v))
  return params.toString() ? '?' + params : ''
}
export const money = n => Number(n || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
export function dateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const pad = n => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`
}
export function birthDate(value) {
  if (!value) return '—'
  const [y,m,d] = String(value).slice(0,10).split('-')
  return y && m && d ? `${d}/${m}/${y}` : value
}
export function statusName(v) {
  return ({1:'Activo',0:'Inactivo',PENDIENTE:'Pendiente',ATENDIDA:'Atendida',CANCELADA:'Cancelada',ELIMINADA:'Eliminada',ACTIVA:'Activa'})[v] || v || '—'
}
export function exportCsv(rows, filename='reporte-sicefa.csv') {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const escape = x => { const v=String(x ?? ''); return '"'+ (/^[=+@-]/.test(v) && !/^-?\d+(?:\.\d+)?$/.test(v) ? '\''+v : v).replaceAll('"','""')+'"' }
  const csv = '\ufeff' + [headers.join(','), ...rows.map(row => headers.map(k=>escape(row[k])).join(','))].join('\r\n')
  const url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}))
  const link = document.createElement('a'); link.href=url;link.download=filename;link.click()
  setTimeout(()=>URL.revokeObjectURL(url),300)
}

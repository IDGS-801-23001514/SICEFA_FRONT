import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const Context = createContext(null)
export function AuthProvider({children}) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const refresh = async () => {
    try { const response = await api('/auth/me'); setUser(response.user); setOffline(false) }
    catch (error) {
      if (error.message.startsWith('No se pudo contactar')) setOffline(true)
      else { setUser(null); setOffline(false) }
    }
    finally { setLoading(false) }
  }
  useEffect(() => {
    refresh()
    const expired = () => setUser(null)
    window.addEventListener('sicefa-unauthorized', expired)
    window.addEventListener('online', refresh)
    return () => { window.removeEventListener('sicefa-unauthorized', expired); window.removeEventListener('online', refresh) }
  }, [])
  const login = async (usuario,password) => {
    const r=await api('/auth/login',{ method:'POST',body:{usuario,password} })
    setUser(r.user)
    return r.user
  }
  const logout = async () => {
    try { await api('/auth/logout',{method:'POST'}) } finally {setUser(null)}
  }
  return <Context.Provider value={{user,loading,offline,login,logout,refresh}}>{children}</Context.Provider>
}
export const useAuth=()=>useContext(Context)

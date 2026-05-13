import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const RightsContext = createContext({})

const DEFAULT_RIGHTS = {
  SALES_VIEW:   0,
  SALES_ADD:    0,
  SALES_EDIT:   0,
  SALES_DEL:    0,
  SD_VIEW:      0,
  SD_ADD:       0,
  SD_EDIT:      0,
  SD_DEL:       0,
  CUST_LOOKUP:  0,
  EMP_LOOKUP:   0,
  PROD_LOOKUP:  0,
  PRICE_LOOKUP: 0,
  ADM_USER:     0,
}

export function RightsProvider({ children }) {
  const { currentUser } = useAuth()
  const [rights, setRights] = useState(DEFAULT_RIGHTS)
  const [rightsLoaded, setRightsLoaded] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      setRights(DEFAULT_RIGHTS)
      setRightsLoaded(false)
      return
    }

    supabase
      .from('UserModule_Rights')
      .select('rightcode, right_value')
      .eq('userId', currentUser.userId)
      .then(({ data, error }) => {
        if (data && data.length > 0) {
          const map = { ...DEFAULT_RIGHTS }
          data.forEach(r => {
            const code = r.rightcode
            if (code) map[code] = r.right_value
          })
          setRights(map)
        }
        setRightsLoaded(true)
      })
  }, [currentUser])

  // Declare these FIRST so checkRight can reference them
  const isAdmin = currentUser?.user_type === 'ADMIN' || currentUser?.user_type === 'SUPERADMIN'
  const isSuperAdmin = currentUser?.user_type === 'SUPERADMIN'

  // Helper to check if a specific right is granted (1 = True)
  // ADMIN implicitly gets all ADD/EDIT/VIEW/LOOKUP rights (but NOT DEL — SUPERADMIN only)
  const DEL_RIGHTS = ['SALES_DEL', 'SD_DEL']
  const checkRight = (rightCode) => {
    if (isSuperAdmin) return true
    if (isAdmin && !DEL_RIGHTS.includes(rightCode)) return true
    return rights[rightCode] === 1
  }

  return (
    <RightsContext.Provider value={{ 
      rights, 
      rightsLoaded, 
      isAdmin, 
      isSuperAdmin,
      checkRight 
    }}>
      {children}
    </RightsContext.Provider>
  )
}

export const useRights = () => useContext(RightsContext)
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth }  from './AuthContext'

const RightsContext = createContext({})

// All 13 rights — default everything to 0 (deny)
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
  const [rights,       setRights]       = useState(DEFAULT_RIGHTS)
  const [rightsLoaded, setRightsLoaded] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      setRights(DEFAULT_RIGHTS)
      setRightsLoaded(false)
      return
    }

    supabase
      .from('UserModule_Rights')
      .select('rightCode, right_value')
      .eq('userId', currentUser.userId)
      .then(({ data }) => {
        if (data) {
          const map = { ...DEFAULT_RIGHTS }
          data.forEach(r => { map[r.rightCode] = r.right_value })
          setRights(map)
        }
        setRightsLoaded(true)
      })
  }, [currentUser])

  // Convenience: is this user ADMIN or SUPERADMIN?
  const isAdmin = currentUser?.user_type === 'ADMIN' || currentUser?.user_type === 'SUPERADMIN'
  const isSuperAdmin = currentUser?.user_type === 'SUPERADMIN'

  return (
    <RightsContext.Provider value={{ rights, rightsLoaded, isAdmin, isSuperAdmin }}>
      {children}
    </RightsContext.Provider>
  )
}

export const useRights = () => useContext(RightsContext)

import React, { createContext, useState, ReactNode, useContext } from 'react'
import { UserContextType, UserData } from '../types/local/userContext'

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData | null>(null)

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  )
}

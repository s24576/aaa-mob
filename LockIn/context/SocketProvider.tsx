import React, { createContext, useContext, ReactNode } from 'react'
import useWebSocket from '../api/socket/useWebSocket'
import { UserContext } from './UserContext'
import { UserContextType } from '../types/local/userContext'

interface SocketContextType {
  receivedMessage: string
  connectionStatus: string
}

interface SocketProviderProps {
  children: ReactNode
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { userData } = useContext(UserContext) as UserContextType
  const username = userData?.username || 'defaultUser'
  const { receivedMessage, connectionStatus } = useWebSocket(username)

  return (
    <SocketContext.Provider value={{ receivedMessage, connectionStatus }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
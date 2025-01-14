import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import useWebSocket from '../api/socket/useWebSocket'
import { UserContext } from './UserContext'
import { UserContextType } from '../types/local/userContext'

interface SocketContextType {
  receivedMessage: string
  connectionStatus: string
  messengerMessage: string
  memberEvent: string
  memberAction: string
  notificationCount: number
  setNotificationCount: React.Dispatch<React.SetStateAction<number>> // Added new property
}

interface SocketProviderProps {
  children: ReactNode
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { userData } = useContext(UserContext) as UserContextType
  const username = userData?.username || 'defaultUser'
  const {
    receivedMessage,
    connectionStatus,
    messengerMessage,
    memberEvent,
    memberAction,
  } = useWebSocket(username)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    if (receivedMessage.includes('friendRequest') || memberAction.includes('friendRequest')) {
      setNotificationCount((prev) => prev + 1)
    }
  }, [receivedMessage, memberAction])

  return (
    <SocketContext.Provider
      value={{
        receivedMessage,
        connectionStatus,
        messengerMessage,
        memberEvent,
        memberAction,
        notificationCount,
        setNotificationCount, // Added new property
      }}
    >
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

import { useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import { Client, IMessage, IFrame } from '@stomp/stompjs'

interface UseWebSocketResult {
  receivedMessage: string
  connectionStatus: string
  messengerMessage: string
  memberEvent: string
  memberAction: string // Added new property
}

const BACKEND_WS_ADDRESS = process.env.BACKEND_ADDRESS + '/ws'

const useWebSocket = (username: string): UseWebSocketResult => {
  const [receivedMessage, setReceivedMessage] = useState<string>('')
  const [connectionStatus, setConnectionStatus] =
    useState<string>('Connecting...')
  const [messengerMessage, setMessengerMessage] = useState<string>('')
  const [memberEvent, setMemberEvent] = useState<string>('')
  const [memberAction, setMemberAction] = useState<string>('') // Added new state
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    // Initialize SockJS and STOMP client
    const socket = new SockJS(BACKEND_WS_ADDRESS)
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: function (str: string) {
        // console.log('STOMP Debug: ', str)
      },
      onConnect: () => {
        // console.log('Connected')
        setConnectionStatus('Connected')
        const subscriptions = [
          `/user/${username}/notification`,
          `/user/${username}/friendRequest/to`,
          `/user/${username}/friendRequest/from`,
          `/user/${username}/delete/friendRequest/to`,
          `/user/${username}/delete/friendRequest/from`,
          `/user/${username}/messenger/message`,
          `/user/${username}/member/event`,
          `/user/${username}/messenger/members`,
        ]
        subscriptions.forEach((sub) => {
          stompClient.subscribe(sub, async (message: IMessage) => {
            console.log('STOMP Debug: Received data', message)
            const messageBody = JSON.parse(message.body || '{}')
            const messageContent = messageBody.message || 'No message content'
            if (sub.includes('messenger/message')) {
              setMessengerMessage(messageContent)
            } else if (sub.includes('member/event')) {
              setMemberEvent(messageContent)
            } else if (sub.includes('messenger/members')) {
              setMemberAction(messageContent)
            } else {
              setReceivedMessage(messageContent)
            }
          })
        })
      },
      onStompError: (frame: IFrame) => {
        console.error('STOMP error: ', frame)
        setConnectionStatus('STOMP Error')
      },
      onWebSocketClose: () => {
        setConnectionStatus('Disconnected')
      },
    })

    stompClient.activate()
    setClient(stompClient)

    // Cleanup connection when component is unmounted
    return () => {
      if (client) {
        client.deactivate()
      }
    }
  }, [username])

  return {
    receivedMessage,
    connectionStatus,
    messengerMessage,
    memberEvent,
    memberAction, // Added new return value
  }
}

export default useWebSocket

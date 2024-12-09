import { useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import { Client, IMessage, IFrame } from '@stomp/stompjs'

interface UseWebSocketResult {
  receivedMessage: string
  connectionStatus: string
}

const useWebSocket = (username: string): UseWebSocketResult => {
  const [receivedMessage, setReceivedMessage] = useState<string>('')
  const [connectionStatus, setConnectionStatus] =
    useState<string>('Connecting...')
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    // Initialize SockJS and STOMP client
    const socket = new SockJS('https://whrnn3rw-8080.euw.devtunnels.ms/ws')
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: function (str: string) {
        console.log('STOMP Debug: ', str)
      },
      onConnect: () => {
        console.log('Connected')
        setConnectionStatus('Connected')
        const subscriptions = [
          `/user/${username}/notification`,
          `/user/${username}/friendRequest/to`,
          `/user/${username}/friendRequest/from`,
          `/user/${username}/delete/friendRequest/to`,
          `/user/${username}/delete/friendRequest/from`,
        ]
        subscriptions.forEach((sub) => {
          stompClient.subscribe(sub, (message: IMessage) => {
            setReceivedMessage(message.body || 'No message content')
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

  return { receivedMessage, connectionStatus }
}

export default useWebSocket

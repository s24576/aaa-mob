import { Client, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const createWebSocketClient = (username: string, onMessage: (message: IMessage) => void) => {
  const socket = new SockJS('wss://whrnn3rw-8080.euw.devtunnels.ms/ws')
  const client = new Client({
    webSocketFactory: () => socket,
    debug: function (str) {
      console.log('STOMP Debug: ', str)
    },
    onConnect: () => {
      console.log('Connected to WebSocket')

      // Subscribe to various topics
      client.subscribe(`/user/${username}/notification`, onMessage)
      client.subscribe(`/user/${username}/friendRequest/to`, onMessage)
      client.subscribe(`/user/${username}/friendRequest/from`, onMessage)
      client.subscribe(`/user/${username}/delete/friendRequest/to`, onMessage)
      client.subscribe(`/user/${username}/delete/friendRequest/from`, onMessage)
    },
    onStompError: (error) => {
      console.error('STOMP Error:', error)
    },
  })

  client.activate()
  return client
}

export default createWebSocketClient

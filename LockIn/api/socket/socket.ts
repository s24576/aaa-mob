import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const socket = new SockJS('https://whrnn3rw-8080.euw.devtunnels.ms/ws')
const client = new Client({
  webSocketFactory: () => socket,
  debug: function (str) {
    console.log('STOMP Debug: ', str)
  },
  onConnect: () => {
    console.log('Connected')
    client.subscribe(`/user/${userData.username}/notification`, (message) => {
      console.log('Message received: ', message.body)
      setReceivedMessage(message.body)
      toast.message('Notification:', {
        description: message.body,
        duration: 2000,
        position: 'top-right',
      })
    })
  },
})

client.activate()

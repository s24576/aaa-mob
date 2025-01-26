import { useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import { Client, IMessage, IFrame } from '@stomp/stompjs'

interface UseWebSocketResult {
  receivedMessage: string
  connectionStatus: string
  messengerMessage: string
  memberEvent: string
  memberAction: string
  duoAnswer: string
  duoNotification: string
}

const BACKEND_WS_ADDRESS = process.env.BACKEND_ADDRESS + '/ws'

const useWebSocket = (username: string): UseWebSocketResult => {
  const [receivedMessage, setReceivedMessage] = useState<string>('')
  const [connectionStatus, setConnectionStatus] =
    useState<string>('Connecting...')
  const [messengerMessage, setMessengerMessage] = useState<string>('')
  const [memberEvent, setMemberEvent] = useState<string>('')
  const [memberAction, setMemberAction] = useState<string>('')
  const [duoAnswer, setDuoAnswer] = useState<string>('')
  const [duoNotification, setDuoNotification] = useState<string>('')
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    const socket = new SockJS(BACKEND_WS_ADDRESS)
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: function (str: string) {},
      onConnect: () => {
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
          `/user/${username}/notification`,
        ]
        console.log('STOMP Debug: Subscribing to', subscriptions)
        subscriptions.forEach((sub) => {
          stompClient.subscribe(sub, (message: IMessage) => {
            console.log('STOMP Debug: Received data', message)
            const messageBody = message.binaryBody
              ? new TextDecoder().decode(message.binaryBody)
              : message.body
            try {
              if (message.headers['content-type'] === 'application/json') {
                const parsedMessage = JSON.parse(messageBody || '{}')
                const messageContent =
                  parsedMessage.message || messageBody || 'No message content'
                if (sub.includes('messenger/message')) {
                  setMessengerMessage(messageContent)
                } else if (sub.includes('member/event')) {
                  setMemberEvent(messageContent)
                } else if (sub.includes('messenger/members')) {
                  setMemberAction(messageContent)
                } else if (sub.includes('team/duo/answer')) {
                  setDuoAnswer(messageContent)
                } else if (sub.includes('notification')) {
                  setDuoNotification(messageContent)
                } else {
                  setReceivedMessage(messageContent)
                }
              } else {
                if (sub.includes('messenger/message')) {
                  setMessengerMessage(messageBody)
                } else if (sub.includes('member/event')) {
                  setMemberEvent(messageBody)
                } else if (sub.includes('messenger/members')) {
                  setMemberAction(messageBody)
                } else if (sub.includes('team/duo/answer')) {
                  setDuoAnswer(messageBody)
                } else if (sub.includes('notification')) {
                  setDuoNotification(messageBody)
                } else {
                  setReceivedMessage(messageBody)
                }
              }
            } catch (error) {
              console.error('Error parsing message:', error)
              setReceivedMessage(messageBody || 'No message content')
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
    memberAction,
    duoAnswer,
    duoNotification,
  }
}

export default useWebSocket

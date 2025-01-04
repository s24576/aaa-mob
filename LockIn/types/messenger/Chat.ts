export interface Chat {
  _id: string
  name: string
  privateChat: boolean
  members: { username: string; nickname: string | null }[]
  lastMessage: {
    _id: string
    chatId: string
    userId: string
    respondingTo: string
    message: string
    timestamp: number
  } | null
  totalMessages: number
  timestamp: number
}

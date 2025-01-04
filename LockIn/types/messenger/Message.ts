// types/Message.ts
export interface Message {
  _id: string
  chatId: string
  userId: string
  respondingTo: string | null
  message: string
  timestamp: number
}

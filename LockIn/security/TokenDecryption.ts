import { createDecipheriv } from 'crypto'

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string // Should be 32 bytes for AES-256

export const decryptToken = (encryptedToken: string): string => {
  const iv = Buffer.from(encryptedToken.slice(0, 32), 'hex') // Extract IV from the encrypted token
  const encrypted = encryptedToken.slice(32)
  const decipher = createDecipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'hex'),
    iv
  )
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')
  return decrypted
}

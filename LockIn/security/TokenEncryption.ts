import { createCipheriv, randomBytes } from 'crypto'

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string // Should be 32 bytes for AES-256

export const encryptToken = (token: string): string => {
  const iv = randomBytes(16) // Initialization vector
  const cipher = createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'hex'),
    iv
  )
  let encrypted = cipher.update(token, 'utf-8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + encrypted // Prepend IV to the encrypted string for decryption
}

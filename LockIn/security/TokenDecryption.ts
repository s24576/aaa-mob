import * as Crypto from 'expo-crypto'

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string

export const decryptToken = async (encryptedToken: string): Promise<string> => {
  const iv = encryptedToken.slice(0, 32) // Pobierz IV
  const encrypted = encryptedToken.slice(32)

  const decrypted = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    encryptionKey + encrypted + iv
  )

  return decrypted
}

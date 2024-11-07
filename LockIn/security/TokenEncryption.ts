import * as Crypto from 'expo-crypto'

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string

const uint8ArrayToHex = (arr: Uint8Array): string => {
  return Array.from(arr)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export const encryptToken = async (token: string): Promise<string> => {
  const iv = Crypto.getRandomBytes(16)

  const combinedString = encryptionKey + token + uint8ArrayToHex(iv)

  const cipher = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    combinedString
  )

  return uint8ArrayToHex(iv) + cipher
}

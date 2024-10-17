import * as Crypto from 'expo-crypto'

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string // Upewnij się, że klucz ma 32 bajty dla AES-256

// Funkcja do konwersji tablicy bajtów na ciąg hex
const uint8ArrayToHex = (arr: Uint8Array): string => {
  return Array.from(arr)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export const encryptToken = async (token: string): Promise<string> => {
  const iv = Crypto.getRandomBytes(16) // Wektor inicjalizujący

  // Łączenie klucza szyfrowania, tokenu i IV w celu stworzenia skrótu
  const combinedString = encryptionKey + token + uint8ArrayToHex(iv)

  // Tworzenie skrótu SHA-256
  const cipher = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    combinedString
  )

  return uint8ArrayToHex(iv) + cipher // Dodaj IV do zaszyfrowanego tokenu
}

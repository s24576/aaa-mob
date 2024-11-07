import axios from 'axios'

export const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error('Error:', error.response.data)
    } else if (error.request) {
      console.error('Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
  } else if (error instanceof Error) {
    console.error('Unexpected Error:', error.message)
  } else {
    console.error('Unknown Error:', error)
  }
}

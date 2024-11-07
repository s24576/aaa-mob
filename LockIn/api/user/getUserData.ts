import axios from 'axios'
import { UserData, Friend } from '../../types/local/userContext'
import { handleError } from '../error/handleError'

const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS

interface FriendResponse {
  _id: string
  username: string
  username2: string
}

export const getUserData = async (
  token: string,
  setUserData: (userData: UserData) => void
) => {
  try {
    const response = await axios.get(`${BACKEND_ADDRESS}/user/getUserData`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'en',
      },
    })
    console.log('User Data:', response.data)

    const userData = new UserData(
      response.data._id,
      response.data.profileIcon,
      response.data.bio,
      response.data.friends.map(
        (friend: FriendResponse) =>
          new Friend(friend._id, friend.username, friend.username2)
      ),
      response.data.username
    )
    setUserData(userData)
  } catch (error) {
    handleError(error)
  }
}

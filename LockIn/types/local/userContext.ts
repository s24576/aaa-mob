export class UserData {
  public _id: string
  public profileIcon: string | null
  public bio: string | null
  public friends: Friend[]
  public username: string
  public image: any

  constructor(
    _id: string,
    profileIcon: string | null,
    bio: string | null,
    friends: Friend[],
    username: string,
    image: any
  ) {
    this._id = _id
    this.profileIcon = profileIcon
    this.bio = bio
    this.friends = friends
    this.username = username
    this.image = image
  }

  getUserData() {
    return {
      _id: this._id,
      profileIcon: this.profileIcon,
      bio: this.bio,
      friends: this.friends,
      username: this.username,
      image: this.image,
    }
  }
}
export interface UserContextType {
  userData: UserData | null
  setUserData: (userData: UserData) => void
}

export class Friend {
  constructor(
    public _id: string,
    public username: string,
    public username2: string
  ) {}
}

export interface WatchListItem {
  id: string
  name: string
  server: string
}

export interface MyAccountItem {
  id: string
  name: string
  server: string
}

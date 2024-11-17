export class UserData {
  public _id: string
  public profileIcon: string | null
  public bio: string | null
  public friends: Friend[]
  public username: string

  constructor(
    _id: string,
    profileIcon: string | null,
    bio: string | null,
    friends: Friend[],
    username: string
  ) {
    this._id = _id
    this.profileIcon = profileIcon
    this.bio = bio
    this.friends = friends
    this.username = username
  }

  getUserData() {
    return {
      _id: this._id,
      profileIcon: this.profileIcon,
      bio: this.bio,
      friends: this.friends,
      username: this.username,
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

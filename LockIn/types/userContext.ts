export class UserData {
  public _id: string;
  public profileIcon: string | null;
  public bio: string | null;
  public friends: Friend[];
  public username: string;

  constructor(
    _id: string,
    profileIcon: string | null,
    bio: string | null,
    friends: Friend[],
    username: string
  ) {
    this._id = _id;
    this.profileIcon = profileIcon;
    this.bio = bio;
    this.friends = friends;
    this.username = username;
  }
}
export interface UserContextType {
  userData: UserData | null;
  setUserData: (userData: UserData) => void;
}

// Friend class to represent each friend's data
export class Friend {
  constructor(
    public _id: string,
    public username: string,
    public username2: string
  ) {}
}

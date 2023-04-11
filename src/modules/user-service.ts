import { IUser } from './user-schema';
import { User } from '@/models/User';

export async function showUserInfo(userInfo: IUser) {
  const user = new User(userInfo);
  return user.save();
}

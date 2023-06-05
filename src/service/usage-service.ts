import { UserModel } from '@/model/User';

export async function nextUsageInfo() {
  try {
    const users = await UserModel.find();
    return users;
  } catch (error) {
    console.error('Error fetching database', error);
    throw error;
  }
}

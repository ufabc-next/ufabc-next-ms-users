import { userModel } from '@/model/User';

export async function nextUsageInfo() {
  try {
    const users = await userModel.find();
    return users;
  } catch (error) {
    console.error('Error fetching database', error);
    throw error;
  }
}

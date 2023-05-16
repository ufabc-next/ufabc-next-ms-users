import { Model, ObjectId, Schema, model } from 'mongoose';
import { User } from './zod/UserSchema';

type UserMethods = {
  addDevice(device: User['devices']): void;
  removeDevice(deviceId: ObjectId): Array<ObjectId>;
  sendNotification(title: string, body: {}): Promise<any>;
  sendConfirmation(): Promise<void>;
};

type UserModel = Model<User, {}, UserMethods>;

const userSchema = new Schema<User, UserModel, UserMethods>({
  ra: {
    unique: true,
    partialFilterExpression: { ra: { $exists: true } },
  },
  email: {
    validate: {
      validator: (v: string) => v.indexOf('ufabc.edu.br') !== -1,
      message: (props) => `${props.value} não é um e-mail válido.`,
    },
    unique: true,
    partialFilterExpression: { email: { $exists: true } },
  },
  confirmed: {
    default: false,
  },
  active: {
    default: true,
  },
});

export const userModel = model<User, UserModel>('User', userSchema);

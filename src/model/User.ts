import { Model, ObjectId, Schema, model } from 'mongoose';
import { uniqBy } from 'remeda';
import { User } from './zod/UserSchema';
import { Unpacked } from '@/helpers/types/unpacked';

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

userSchema.method(
  'addDevice',
  function (this: User, device: Unpacked<User['devices']>) {
    this.devices.unshift(device);
    const uniqueDevice = uniqBy(this.devices, (device) => device.deviceId);
    this.devices = uniqueDevice;
  },
);

userSchema.method('removeDevice', function (this: User, deviceId: string) {
  this.devices = this.devices.filter((device) => device.deviceId !== deviceId);
});

export const userModel = model<User, UserModel>('User', userSchema);

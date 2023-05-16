import { Model, ObjectId, Schema, model } from 'mongoose';
import { uniqBy } from 'remeda';
import { User } from './zod/UserSchema';
import { Unpacked } from '@/helpers/types/unpacked';

// TODO: Create the methods for email Confirmation and generateJWT

type UserMethods = {
  addDevice(device: User['devices']): void;
  removeDevice(deviceId: ObjectId): Array<ObjectId>;
  sendNotification(title: string, body: {}): Promise<any>;
  sendConfirmation(): Promise<void>;
};

type UserModel = Model<User, {}, UserMethods>;

const userSchema = new Schema<User, UserModel, UserMethods>({
  ra: {
    type: Number,
    unique: true,
    partialFilterExpression: { ra: { $exists: true } },
  },
  email: {
    type: String,
    validate: {
      validator: (v: string) => v.indexOf('ufabc.edu.br') !== -1,
      message: (props) => `${props.value} não é um e-mail válido.`,
    },
    unique: true,
    partialFilterExpression: { email: { $exists: true } },
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.virtual('isFilled').get(function () {
  return this.ra && this.email;
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

userSchema.pre('save', async function (this: any) {
  if (this.isFilled && !this.confirmed) {
    this.sendConfirmation();
  }
});

userSchema.index({ ra: -1 });

export const userModel = model<User, UserModel>('User', userSchema);

import mongoose, { Schema } from 'mongoose';
import { UserType } from '../types/Usertype';

const UserSchema = new Schema<UserType>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email is invalid',
      ],
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    role: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<UserType>('User', UserSchema);

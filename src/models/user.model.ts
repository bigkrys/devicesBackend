import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
  // 可扩展字段
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    minlength: 3,
    maxlength: 32
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // 默认查询不返回密码
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'operator', 'viewer']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true
  }
}, {
  timestamps: true,
  versionKey: false
});

UserSchema.index({ username: 1 }, { unique: true });

export const UserModel = mongoose.model<IUser>('User', UserSchema); 
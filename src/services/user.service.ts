import { UserModel, IUser } from '../models/user.model';
import bcrypt from 'bcrypt';
import { AppError } from '../middlewares/error';

const SALT_ROUNDS = 12;

export class UserService {
  /**
   * 注册新用户
   */
  static async register(username: string, password: string, email?: string): Promise<IUser> {
    // 检查用户名唯一性
    const existing = await UserModel.findOne({ username });
    if (existing) {
      throw new AppError(409, '用户名已存在');
    }
    // 密码加密
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new UserModel({ username, password: hash, email });
    await user.save();
    return user as IUser;
  }

  /**
   * 按用户名查找用户（包含密码）
   */
  static async findByUsernameWithPassword(username: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ username }).select('+password');
    return user as IUser | null;
  }

  /**
   * 按用户名查找用户（不含密码）
   */
  static async findByUsername(username: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ username });
    return user as IUser | null;
  }

  /**
   * 校验密码
   */
  static async verifyPassword(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }
} 
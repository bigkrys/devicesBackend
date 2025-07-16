import { Context } from 'koa';
import { UserService } from '../services/user.service';
import { JWTUtil } from '../utils/jwt';
import { AppError } from '../middlewares/error';

export class UserController {
  /**
   * 用户注册（注册成功自动登录，返回token和用户信息）
   */
  static async register(ctx: Context) {
    const { username, password, email } = ctx.request.body as { username: string; password: string; email?: string };
    if (!username || !password) {
      throw new AppError(400, '用户名和密码为必填项');
    }
    const user = await UserService.register(username, password, email);
    // 生成token
    const token = JWTUtil.generateToken({ userId: user._id.toString(), username: user.username, role: user.role });
    ctx.body = {
      success: true,
      data: {
        token,
        user: {
          userId: user._id,
          username: user.username,
          role: user.role,
          email: user.email
        }
      }
    };
  }

  /**
   * 用户登录（用户名+密码，返回token和用户信息）
   */
  static async login(ctx: Context) {
    const { username, password } = ctx.request.body as { username: string; password: string };
    if (!username || !password) {
      throw new AppError(400, '用户名和密码为必填项');
    }
    const user = await UserService.findByUsernameWithPassword(username);
    if (!user) {
      throw new AppError(401, '用户名或密码错误');
    }
    const valid = await UserService.verifyPassword(password, user.password);
    if (!valid) {
      throw new AppError(401, '用户名或密码错误');
    }
    // 生成token
    const token = JWTUtil.generateToken({ userId: user._id.toString(), username: user.username, role: user.role });
    ctx.body = {
      success: true,
      data: {
        token,
        user: {
          userId: user._id,
          username: user.username,
          role: user.role,
          email: user.email
        }
      }
    };
  }
} 
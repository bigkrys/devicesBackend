import { Context, Next } from 'koa';
import { JWTUtil } from '../utils/jwt';

/**
 * JWT认证中间件
 * @param ctx Koa上下文
 * @param next 下一个中间件
 */
export async function authMiddleware(ctx: Context, next: Next) {
  try {
    const authorization = ctx.headers.authorization;
    const token = JWTUtil.extractTokenFromHeader(authorization);
    console.log(token);
    const payload = JWTUtil.verifyToken(token);
    
    // 将解码后的用户信息存储在上下文中
    ctx.state.user = payload;
    
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: error instanceof Error ? error.message : '认证失败'
    };
  }
}

/**
 * 角色验证中间件工厂函数
 * @param allowedRoles 允许访问的角色列表
 */
export function roleCheck(allowedRoles: string[]) {
  return async (ctx: Context, next: Next) => {
    const user = ctx.state.user;
    
    if (!user || !user.role) {
      ctx.status = 403;
      ctx.body = {
        success: false,
        message: '无访问权限'
      };
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      ctx.status = 403;
      ctx.body = {
        success: false,
        message: '当前角色无权访问'
      };
      return;
    }

    await next();
  };
} 
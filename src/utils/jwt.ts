import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface JWTPayload extends JwtPayload {
  userId: string;
  role: string;
  [key: string]: any; // 允许添加其他自定义字段
}

export class JWTUtil {
  private static readonly secret = config.jwt.secret;
  private static readonly expiresIn = config.jwt.expiresIn;

  /**
   * 生成JWT token
   * @param payload 需要编码到token中的数据
   * @returns 生成的token字符串
   */
  public static generateToken(payload: JWTPayload): string {
    const options = {
      expiresIn: this.expiresIn
    } as SignOptions;

    return jwt.sign(
      payload,
      this.secret as jwt.Secret,
      options
    );
  }

  /**
   * 验证并解码JWT token
   * @param token JWT token字符串
   * @returns 解码后的payload数据
   * @throws 如果token无效或已过期，将抛出错误
   */
  public static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.secret as jwt.Secret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token已过期');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('无效的Token');
      }
      throw error;
    }
  }

  /**
   * 从请求头的Authorization中提取token
   * @param authorization Authorization头的值
   * @returns token字符串
   * @throws 如果Authorization头格式不正确，将抛出错误
   */
  public static extractTokenFromHeader(authorization?: string): string {
    if (!authorization) {
      throw new Error('未提供Authorization头');
    }

    const parts = authorization.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new Error('Authorization头格式不正确');
    }

    return parts[1];
  }

  /**
   * 解码JWT token（不验证签名和过期时间）
   * @param token JWT token字符串
   * @returns 解码后的payload数据
   */
  public static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      return null;
    }
  }
} 
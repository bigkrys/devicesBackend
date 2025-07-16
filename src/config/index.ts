import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/device_management'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    credentials: true
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug'
  }
}; 
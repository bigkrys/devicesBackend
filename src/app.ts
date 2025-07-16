import Koa from 'koa';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import { config } from './config';
import { errorHandler } from './middlewares/error';
import { connectDatabase } from './utils/database';
import deviceRoutes from './routes/device.routes';
import authRoutes from './routes/auth.routes';

const app = new Koa();

// 连接数据库
connectDatabase();

// 中间件
app.use(logger());
app.use(cors({
  origin: (ctx) => {
    const requestOrigin = ctx.get('Origin');
    if (config.cors.allowedOrigins.includes(requestOrigin)) {
      return requestOrigin;
    }
    return config.cors.allowedOrigins[0];
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  maxAge: 86400
}));
app.use(helmet());
app.use(bodyParser());
app.use(errorHandler());

// 路由
app.use(deviceRoutes.routes());
app.use(deviceRoutes.allowedMethods());
app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());

// 错误处理
app.on('error', (err, ctx) => {
  console.error('服务器错误', err);
  ctx.status = err.status || 500;
  ctx.body = {
    success: false,
    message: err.message || '服务器内部错误'
  };
});

// 启动服务器
const port = config.server.port || 3000;
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 
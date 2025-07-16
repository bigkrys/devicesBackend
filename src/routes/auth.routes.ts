import Router from '@koa/router';
import { UserController } from '../api/user.controller';
// import { authMiddleware, roleCheck } from '../middlewares/auth.middleware';

const router = new Router({
  prefix: '/api/auth'
});

// 注册接口
router.post('/register', UserController.register);

// 登录接口
router.post('/login', UserController.login);

// 其他接口可后续补充

export default router; 
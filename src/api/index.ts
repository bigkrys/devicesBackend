import Koa from 'koa';
import Router from '@koa/router';

const router = new Router({
  prefix: '/api/'
});

export const setupRoutes = (app: Koa) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
}; 
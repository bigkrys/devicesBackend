import Router from '@koa/router';
import { Context } from 'koa';
import { DeviceService } from '../services/device.service';
import { Device, DeviceStatus, DeviceType } from '../types';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = new Router({
  prefix: '/api/devices'
});

// 鉴权中间件，保护所有设备接口
router.use(authMiddleware);

const deviceService = new DeviceService();

interface CreateDeviceRequest {
  devices: Partial<Device>[];
}

// 创建设备
router.post('/', async (ctx: Context) => {
  const deviceData = ctx.request.body as Partial<Device>;
  const device = await deviceService.createDevice(deviceData);
  ctx.body = {
    success: true,
    data: device
  };
});

// 获取设备列表
router.get('/', async (ctx: Context) => {
  const { page, limit, type, status, location, search } = ctx.query;
  const devices = await deviceService.getDevices({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    type: type as DeviceType,
    status: status as DeviceStatus,
    location: location as string,
    search: search as string
  });
  ctx.body = {
    success: true,
    data: devices
  };
});

// 获取单个设备
router.get('/:id', async (ctx: Context) => {
  const device = await deviceService.getDeviceById(ctx.params.id);
  if (!device) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      message: '设备不存在'
    };
    return;
  }
  ctx.body = {
    success: true,
    data: device
  };
});

// 更新设备
router.put('/:id', async (ctx: Context) => {
  const device = await deviceService.updateDevice(
    ctx.params.id,
    ctx.request.body as Partial<Device>
  );
  if (!device) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      message: '设备不存在'
    };
    return;
  }
  ctx.body = {
    success: true,
    data: device
  };
});

// 删除设备
router.delete('/:id', async (ctx: Context) => {
  const success = await deviceService.deleteDevice(ctx.params.id);
  if (!success) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      message: '设备不存在'
    };
    return;
  }
  ctx.body = {
    success: true,
    message: '设备已删除'
  };
});

// 批量创建设备
router.post('/batch', async (ctx: Context) => {
  const { devices } = ctx.request.body as CreateDeviceRequest;
  const createdDevices = await deviceService.createDevices(devices);
  ctx.body = {
    success: true,
    data: createdDevices
  };
});

// 更新设备状态
router.patch('/:id/status', async (ctx: Context) => {
  const { status } = ctx.request.body as { status: DeviceStatus };
  const device = await deviceService.updateDeviceStatus(ctx.params.id, status);
  if (!device) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      message: '设备不存在'
    };
    return;
  }
  ctx.body = {
    success: true,
    data: device
  };
});

// 获取设备统计信息
router.get('/statistics', async (ctx: Context) => {
  const stats = await deviceService.getStatistics();
  ctx.body = {
    success: true,
    data: stats
  };
});

export default router; 
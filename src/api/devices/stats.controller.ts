import { Context } from 'koa';
import { DeviceService } from '../../services/device.service';

export class DeviceStatsController {
  static async getStats(ctx: Context) {
    const deviceService = new DeviceService();
    const stats = await deviceService.getStatistics();
    ctx.body = {
      success: true,
      data: stats
    };
  }
} 
import { DeviceService } from './device.service';

describe('DeviceService - getStatistics', () => {
  let deviceService: DeviceService;

  beforeAll(() => {
    deviceService = new DeviceService();
  });

  it('should return statistics with total, byType, byStatus, byLocation', async () => {
    const stats = await deviceService.getStatistics();
    expect(stats).toHaveProperty('total');
    expect(stats).toHaveProperty('byType');
    expect(stats).toHaveProperty('byStatus');
    expect(stats).toHaveProperty('byLocation');
    // 可根据实际数据进一步断言
  });
}); 
import { Device, DeviceStatus, DeviceType } from '../types';
import { Device as DeviceModel, IDevice, ILocation, ISpecifications } from '../api/devices/model';
import mongoose from 'mongoose';

export interface DeviceQuery {
  page?: number;
  limit?: number;
  type?: DeviceType;
  status?: DeviceStatus;
  location?: string;
  search?: string;
}

export interface DeviceStatistics {
  total: number;
  byType: Record<DeviceType, number>;
  byStatus: Record<DeviceStatus, number>;
  byLocation: Record<string, number>;
}

export class DeviceService {
  /**
   * 创建设备
   */
  async createDevice(deviceData: Partial<Device>): Promise<Device> {
    const defaultLocation: ILocation = {
      longitude: 0,
      latitude: 0,
      address: 'Unknown Location'
    };

    const defaultSpecifications: ISpecifications = {
      model: 'Unknown Model',
      manufacturer: 'Unknown Manufacturer',
      productionDate: new Date()
    };

    // 确保必填字段存在
    const device = await DeviceModel.create({
      name: deviceData.name || 'Unnamed Device',
      type: deviceData.type || DeviceType.Other,
      status: deviceData.status || DeviceStatus.Offline,
      location: deviceData.location || defaultLocation,
      specifications: deviceData.specifications || defaultSpecifications,
      ...deviceData
    });
    return this.transformDevice(device);
  }

  /**
   * 批量创建设备
   */
  async createDevices(devicesData: Partial<Device>[]): Promise<Device[]> {
    const defaultLocation: ILocation = {
      longitude: 0,
      latitude: 0,
      address: 'Unknown Location'
    };

    const defaultSpecifications: ISpecifications = {
      model: 'Unknown Model',
      manufacturer: 'Unknown Manufacturer',
      productionDate: new Date()
    };

    const preparedDevices = devicesData.map(data => ({
      name: data.name || 'Unnamed Device',
      type: data.type || DeviceType.Other,
      status: data.status || DeviceStatus.Offline,
      location: data.location || defaultLocation,
      specifications: data.specifications || defaultSpecifications,
      ...data
    }));
    const devices = await DeviceModel.insertMany(preparedDevices);
    return devices.map(device => this.transformDevice(device));
  }

  /**
   * 获取设备列表
   */
  async getDevices(query: DeviceQuery): Promise<{ devices: Device[]; total: number }> {
    const { page = 1, limit = 10, search, ...rawFilters } = query;
    const skip = (page - 1) * limit;
    const filters = Object.entries(rawFilters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { type: { $regex: search, $options: 'i' } },
            { 'location.address': { $regex: search, $options: 'i' } }
          ]
        }
      : {};
      console.log(searchQuery, filters);

    const [devices, total] = await Promise.all([
      DeviceModel.find({ ...searchQuery, ...filters }).skip(skip).limit(limit),
      DeviceModel.countDocuments({ ...searchQuery, ...filters })
    ]);

    return {
      devices: devices.map(device => this.transformDevice(device)),
      total
    };
  }

  /**
   * 兼容id/deviceId双查找
   */
  async getDeviceById(idOrDeviceId: string): Promise<Device | null> {
    let device: IDevice | null = null;
    if (mongoose.isValidObjectId(idOrDeviceId)) {
      device = await DeviceModel.findById(idOrDeviceId);
      if (device) return this.transformDevice(device);
    }
    device = await DeviceModel.findOne({ deviceId: idOrDeviceId });
    return device ? this.transformDevice(device) : null;
  }

  /**
   * 更新设备
   */
  async updateDevice(idOrDeviceId: string, updateData: Partial<Device>): Promise<Device | null> {
    let device: IDevice | null = null;
    if (mongoose.isValidObjectId(idOrDeviceId)) {
      device = await DeviceModel.findByIdAndUpdate(idOrDeviceId, updateData, { new: true });
      if (device) return this.transformDevice(device);
    }
    device = await DeviceModel.findOneAndUpdate({ deviceId: idOrDeviceId }, updateData, { new: true });
    return device ? this.transformDevice(device) : null;
  }

  /**
   * 删除设备
   */
  async deleteDevice(idOrDeviceId: string): Promise<boolean> {
    let result = null;
    if (mongoose.isValidObjectId(idOrDeviceId)) {
      result = await DeviceModel.findByIdAndDelete(idOrDeviceId);
      if (result) return true;
    }
    result = await DeviceModel.findOneAndDelete({ deviceId: idOrDeviceId });
    return result !== null;
  }

  /**
   * 更新设备状态
   */
  async updateDeviceStatus(idOrDeviceId: string, status: DeviceStatus): Promise<Device | null> {
    let device: IDevice | null = null;
    if (mongoose.isValidObjectId(idOrDeviceId)) {
      device = await DeviceModel.findByIdAndUpdate(
        idOrDeviceId,
        { $set: { status, lastOnlineTime: status === DeviceStatus.Online ? new Date() : undefined } },
        { new: true }
      );
      if (device) return this.transformDevice(device);
    }
    device = await DeviceModel.findOneAndUpdate(
      { deviceId: idOrDeviceId },
      { $set: { status, lastOnlineTime: status === DeviceStatus.Online ? new Date() : undefined } },
      { new: true }
    );
    return device ? this.transformDevice(device) : null;
  }

  /**
   * 获取设备统计信息
   */
  async getStatistics(): Promise<DeviceStatistics> {
    const [total, byType, byStatus, byLocation] = await Promise.all([
      DeviceModel.countDocuments(),
      DeviceModel.aggregate<{ _id: DeviceType; count: number }>([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      DeviceModel.aggregate<{ _id: DeviceStatus; count: number }>([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      DeviceModel.aggregate<{ _id: string; count: number }>([
        { $match: { 'location.address': { $exists: true, $ne: null } } },
        { $group: { _id: '$location.address', count: { $sum: 1 } } }
      ])
    ]);

    return {
      total,
      byType: this.convertAggregationToRecord<DeviceType>(byType),
      byStatus: this.convertAggregationToRecord<DeviceStatus>(byStatus),
      byLocation: this.convertAggregationToRecord(byLocation)
    };
  }

  /**
   * 将 Mongoose 文档转换为普通对象，输出id和deviceId
   */
  private transformDevice(document: IDevice): Device {
    const { _id, deviceId, ...deviceData } = document.toObject();
    const now = new Date();
    
    return {
      id: _id.toString(),
      deviceId: deviceId,
      ...deviceData,
      createdAt: deviceData.createdAt || now,
      updatedAt: deviceData.updatedAt || now
    } as Device;
  }

  private convertAggregationToRecord<T extends string>(
    aggregation: { _id: T; count: number }[]
  ): Record<T, number> {
    return aggregation.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<T, number>);
  }
} 
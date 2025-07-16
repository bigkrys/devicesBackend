export interface Device {
  name: string;
  type: DeviceType;
  location: string;
  status: DeviceStatus;
  description?: string;
  specifications?: {
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    [key: string]: any;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export type DeviceType = 'sensor' | 'camera' | 'gateway' | 'controller' | 'other';

export type DeviceStatus = 'active' | 'inactive' | 'maintenance' | 'error';

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
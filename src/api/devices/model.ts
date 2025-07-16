import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation {
  longitude: number;
  latitude: number;
  address: string;
}

export interface ISpecifications {
  model: string;
  manufacturer: string;
  productionDate: Date;
  protocol?: string;
  powerSupply?: string;
  ipRating?: string;
  operatingTemperature?: string;
  dimensions?: string;
  measurementRange?: string;
  accuracy?: string;
  responseTime?: string;
  resolution?: string;
  fieldOfView?: string;
  nightVision?: string;
  storageSupport?: string;
}

export interface IDevice extends Document {
  deviceId: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  location: ILocation;
  specifications: ISpecifications;
  lastOnlineTime?: Date;
  lastMaintenanceTime?: Date;
  deploymentDate?: Date;
  warrantyExpiryDate?: Date;
  firmwareVersion?: string;
  maintenanceCycle?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const LocationSchema = new Schema<ILocation>({
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  address: { type: String, required: true },
});

const SpecificationsSchema = new Schema<ISpecifications>({
  model: { type: String, required: true },
  manufacturer: { type: String, required: true },
  productionDate: { type: Date, required: true },
  protocol: { type: String },
  powerSupply: { type: String },
  ipRating: { type: String },
  operatingTemperature: { type: String },
  dimensions: { type: String },
  measurementRange: { type: String },
  accuracy: { type: String },
  responseTime: { type: String },
  resolution: { type: String },
  fieldOfView: { type: String },
  nightVision: { type: String },
  storageSupport: { type: String }
});

const DeviceSchema = new Schema<IDevice>({
  deviceId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    index: true 
  },
  status: { 
    type: String, 
    enum: ['online', 'offline', 'error', 'maintenance'],
    default: 'offline',
    index: true 
  },
  location: { 
    type: LocationSchema, 
    required: true 
  },
  specifications: { 
    type: SpecificationsSchema, 
    required: true 
  },
  lastOnlineTime: { 
    type: Date, 
    default: Date.now 
  },
  lastMaintenanceTime: { 
    type: Date, 
    default: Date.now 
  },
  deploymentDate: {
    type: Date
  },
  warrantyExpiryDate: {
    type: Date
  },
  firmwareVersion: {
    type: String
  },
  maintenanceCycle: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false
});

// 创建索引
DeviceSchema.index({ name: 'text' });
DeviceSchema.index({ createdAt: -1 });
DeviceSchema.index({ updatedAt: -1 });
DeviceSchema.index({ type: 1, status: 1 });
DeviceSchema.index({ warrantyExpiryDate: 1 });

export const Device = mongoose.model<IDevice>('Device', DeviceSchema); 
import { ILocation, ISpecifications } from '../api/devices/model';

// 设备相关类型
export interface Device {
  id: string;
  name: string;
  status: DeviceStatus;
  type: DeviceType;
  location: ILocation;
  specifications: ISpecifications;
  lastOnlineTime?: Date;
  lastMaintenanceTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum DeviceType {
  Sensor = 'sensor',
  Camera = 'camera',
  Gateway = 'gateway',
  Controller = 'controller',
  Other = 'other'
}

export enum DeviceStatus {
  Online = 'online',
  Offline = 'offline',
  Error = 'error'
}

// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export enum UserRole {
  Admin = 'admin',
  Operator = 'operator',
  Viewer = 'viewer'
}

// 认证相关类型
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// 数据可视化相关类型
export interface ChartData {
  title: string;
  type: ChartType;
  data: any;
  options?: Record<string, any>;
}

export enum ChartType {
  Line = 'line',
  Bar = 'bar',
  Pie = 'pie',
  Table = 'table'
}

// 事件相关类型
export interface DeviceEvent {
  id: string;
  deviceId: string;
  type: EventType;
  timestamp: string;
  data: Record<string, any>;
}

export enum EventType {
  StatusChange = 'status_change',
  Alert = 'alert',
  Operation = 'operation',
  Maintenance = 'maintenance'
}

// 微应用通信相关类型
export interface MicroAppMessage {
  type: string;
  payload: any;
  source: string;
  timestamp: number;
}

// 用户DTO（接口返回用，不含密码）
export interface UserDTO {
  userId: string;
  username: string;
  role: string;
  email?: string;
}

// 注册请求DTO
export interface RegisterDTO {
  username: string;
  password: string;
  email?: string;
}

// 登录请求DTO
export interface LoginDTO {
  username: string;
  password: string;
}

// JWT Token Payload
export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
  [key: string]: any;
} 
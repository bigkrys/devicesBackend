import { connectDatabase } from '../../utils/database';
import { Device } from '../../api/devices/model';
import { faker } from '@faker-js/faker/locale/zh_CN';

const DEVICES_COUNT = 100000;
const BATCH_SIZE = 1000;

// 物联网设备类型定义
type DeviceType = 
  | 'temperature_sensor'    // 温度传感器
  | 'humidity_sensor'       // 湿度传感器
  | 'pressure_sensor'       // 压力传感器
  | 'gas_sensor'           // 气体传感器
  | 'light_sensor'         // 光照传感器
  | 'motion_sensor'        // 运动传感器
  | 'voltage_sensor'       // 电压传感器
  | 'current_sensor'       // 电流传感器
  | 'noise_sensor'         // 噪声传感器
  | 'vibration_sensor'     // 振动传感器
  | 'smart_camera'         // 智能摄像头
  | 'gateway'              // 网关设备
  | 'controller'           // 控制器
  | 'display'              // 显示设备
  | 'rfid_reader';         // RFID读取器

const deviceTypes: DeviceType[] = [
  'temperature_sensor', 'humidity_sensor', 'pressure_sensor',
  'gas_sensor', 'light_sensor', 'motion_sensor',
  'voltage_sensor', 'current_sensor', 'noise_sensor',
  'vibration_sensor', 'smart_camera', 'gateway',
  'controller', 'display', 'rfid_reader'
];

const statusTypes = ['online', 'offline', 'error', 'maintenance'] as const;

// 制造商和其专长领域
const manufacturerSpecialties: Record<string, DeviceType[]> = {
  '华为': ['gateway', 'controller', 'smart_camera'],
  '阿里云': ['gateway', 'controller', 'display'],
  '腾讯云': ['gateway', 'smart_camera', 'display'],
  '小米': ['temperature_sensor', 'humidity_sensor', 'light_sensor'],
  '海康威视': ['smart_camera', 'motion_sensor'],
  '大华': ['smart_camera', 'display'],
  '西门子': ['pressure_sensor', 'voltage_sensor', 'current_sensor'],
  '施耐德': ['voltage_sensor', 'current_sensor', 'controller'],
  '欧姆龙': ['motion_sensor', 'vibration_sensor'],
  '霍尼韦尔': ['gas_sensor', 'temperature_sensor', 'pressure_sensor']
};

const manufacturers = Object.keys(manufacturerSpecialties);

// 设备型号前缀
const modelPrefixes: Record<DeviceType, string> = {
  'temperature_sensor': 'TEMP',
  'humidity_sensor': 'HUM',
  'pressure_sensor': 'PRES',
  'gas_sensor': 'GAS',
  'light_sensor': 'LIGHT',
  'motion_sensor': 'MOT',
  'voltage_sensor': 'VOLT',
  'current_sensor': 'CURR',
  'noise_sensor': 'NOISE',
  'vibration_sensor': 'VIB',
  'smart_camera': 'CAM',
  'gateway': 'GTW',
  'controller': 'CTRL',
  'display': 'DISP',
  'rfid_reader': 'RFID'
};

// 通信协议
const protocols = ['MQTT', 'CoAP', 'HTTP', 'Modbus', 'BACnet', 'ZigBee', 'LoRaWAN', 'NB-IoT'];

// 部署场景
const deploymentScenarios = [
  '工厂车间',
  '智能仓库',
  '办公楼',
  '数据中心',
  '农业大棚',
  '智慧城市',
  '交通枢纽',
  '医疗机构',
  '学校',
  '商场'
];

// 根据设备类型生成相关的规格参数
function generateSpecifications(type: DeviceType, manufacturer: string): any {
  const baseSpecs = {
    model: `${modelPrefixes[type]}-${faker.string.alphanumeric(6)}`,
    manufacturer,
    productionDate: faker.date.past({ years: 2 }),
    protocol: faker.helpers.arrayElement(protocols),
    powerSupply: faker.helpers.arrayElement(['AC 220V', 'DC 24V', 'DC 12V', '电池供电']),
    ipRating: faker.helpers.arrayElement(['IP65', 'IP66', 'IP67', 'IP68']),
    operatingTemperature: '-20°C ~ 60°C',
    dimensions: `${faker.number.int({ min: 50, max: 300 })}x${faker.number.int({ min: 50, max: 300 })}x${faker.number.int({ min: 20, max: 100 })}mm`
  };

  // 根据设备类型添加特定参数
  switch(type) {
    case 'temperature_sensor':
      return {
        ...baseSpecs,
        measurementRange: '-40°C ~ 120°C',
        accuracy: '±0.5°C',
        responseTime: '< 2s'
      };
    case 'humidity_sensor':
      return {
        ...baseSpecs,
        measurementRange: '0-100% RH',
        accuracy: '±2% RH',
        responseTime: '< 5s'
      };
    case 'pressure_sensor':
      return {
        ...baseSpecs,
        measurementRange: '0-10MPa',
        accuracy: '±0.1%',
        responseTime: '< 1ms'
      };
    case 'smart_camera':
      return {
        ...baseSpecs,
        resolution: faker.helpers.arrayElement(['1080P', '2K', '4K']),
        fieldOfView: faker.helpers.arrayElement(['120°', '130°', '140°']),
        nightVision: faker.helpers.arrayElement(['10m', '15m', '20m']),
        storageSupport: 'SD Card, NVR'
      };
    default:
      return baseSpecs;
  }
}

async function generateDevices() {
  console.log('开始生成物联网设备数据...');
  
  try {
    await connectDatabase();
    console.log('数据库连接成功');

    // 清空现有设备数据
    await Device.deleteMany({});
    console.log('已清空现有设备数据');

    for (let i = 0; i < DEVICES_COUNT; i += BATCH_SIZE) {
      const devices = [];
      const batchSize = Math.min(BATCH_SIZE, DEVICES_COUNT - i);
      
      for (let j = 0; j < batchSize; j++) {
        const deviceNumber = i + j + 1;
        const manufacturer = faker.helpers.arrayElement(manufacturers);
        // 从制造商的专长领域中选择设备类型
        const type = faker.helpers.arrayElement(manufacturerSpecialties[manufacturer]) as DeviceType;
        const deploymentScenario = faker.helpers.arrayElement(deploymentScenarios);
        
        devices.push({
          deviceId: `${modelPrefixes[type]}${deviceNumber.toString().padStart(8, '0')}`,
          name: `${manufacturer}${type}-${faker.string.alphanumeric(4)}`,
          type,
          status: faker.helpers.arrayElement(statusTypes),
          location: {
            longitude: faker.location.longitude({ min: 73, max: 135 }),
            latitude: faker.location.latitude({ min: 18, max: 53 }),
            address: `${faker.location.state()}${faker.location.city()}${deploymentScenario}`
          },
          specifications: generateSpecifications(type, manufacturer),
          lastOnlineTime: faker.date.recent({ days: 30 }),
          lastMaintenanceTime: faker.date.past({ years: 1 }),
          deploymentDate: faker.date.past({ years: 1 }),
          warrantyExpiryDate: faker.date.future({ years: 3 }),
          firmwareVersion: `v${faker.system.semver()}`,
          maintenanceCycle: faker.helpers.arrayElement(['30天', '60天', '90天', '180天', '365天'])
        });
      }

      await Device.insertMany(devices);
      console.log(`已生成 ${i + batchSize}/${DEVICES_COUNT} 个设备数据`);
    }

    console.log('物联网设备数据生成完成！');
    process.exit(0);
  } catch (error) {
    console.error('生成设备数据时出错:', error);
    process.exit(1);
  }
}

generateDevices(); 
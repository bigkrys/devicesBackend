import Joi from 'joi';
import { AppError } from '../../../middlewares/error';
import { IDevice } from './model';

const locationSchema = Joi.object({
  longitude: Joi.number().required().min(-180).max(180),
  latitude: Joi.number().required().min(-90).max(90),
  address: Joi.string().required().max(200),
});

const specificationsSchema = Joi.object({
  model: Joi.string().required().max(50),
  manufacturer: Joi.string().required().max(100),
  productionDate: Joi.date().required().max('now'),
});

const deviceSchema = Joi.object({
  deviceId: Joi.string().required().pattern(/^[A-Za-z0-9-_]+$/).max(50),
  name: Joi.string().required().max(100),
  type: Joi.string().required().max(50),
  status: Joi.string().valid('online', 'offline', 'error'),
  location: locationSchema.required(),
  specifications: specificationsSchema.required(),
  lastOnlineTime: Joi.date(),
  lastMaintenanceTime: Joi.date(),
});

const deviceQuerySchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  type: Joi.string(),
  status: Joi.string().valid('online', 'offline', 'error'),
  keyword: Joi.string().max(100),
});

export const validateDevice = async (data: Partial<IDevice>, isUpdate = false) => {
  try {
    const schema = isUpdate ? deviceSchema.fork(
      ['deviceId', 'location', 'specifications'],
      (schema) => schema.optional()
    ) : deviceSchema;

    await schema.validateAsync(data, { abortEarly: false });
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      throw new AppError(400, '参数验证失败', 'VALIDATION_ERROR', error.details);
    }
    throw error;
  }
};

export const validateDeviceQuery = async (query: Record<string, unknown>) => {
  try {
    await deviceQuerySchema.validateAsync(query, { abortEarly: false });
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      throw new AppError(400, '查询参数验证失败', 'VALIDATION_ERROR', error.details);
    }
    throw error;
  }
}; 
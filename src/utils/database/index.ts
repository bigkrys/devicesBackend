import mongoose from 'mongoose';
import { config } from '../../config';
import { logger } from '../logger';

export const connectDatabase = async () => {
  try {
    // 打印数据库连接参数
    const connectionParams = {
      uri: config.database.uri,
      options: {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      }
    };
    
    logger.info('Database connection parameters:', {
      uri: connectionParams.uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'), // 隐藏敏感信息
      options: connectionParams.options
    });
    console.log(connectionParams.uri, connectionParams.options);
    await mongoose.connect(connectionParams.uri, connectionParams.options);
    
    logger.info('Successfully connected to database');

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      setTimeout(() => {
        logger.info('Attempting to reconnect to MongoDB...');
        mongoose.connect(connectionParams.uri, connectionParams.options).catch((err) => {
          logger.error('Failed to reconnect to MongoDB:', err);
        });
      }, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    logger.error('Error connecting to database:', error);
    setTimeout(() => {
      logger.info('Retrying database connection...');
      connectDatabase().catch(() => {
        logger.error('Failed to connect to database after retry, exiting...');
        process.exit(1);
      });
    }, 5000);
  }
}; 
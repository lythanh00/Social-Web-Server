import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    try {
      const configResult = v2.config({
        cloud_name: process.env.CLD_CLOUD_NAME,
        api_key: process.env.CLD_API_KEY,
        api_secret: process.env.CLD_API_SECRET,
      });

      // Log thông tin để xác nhận kết nối
      if (configResult) {
        console.log(
          'Cloudinary connection successfully configured:',
          configResult.cloud_name,
        );
      } else {
        console.error('Cloudinary configuration failed');
      }

      return configResult;
    } catch (error) {
      console.error('Error connecting to Cloudinary:', error.message);
    }
  },
};

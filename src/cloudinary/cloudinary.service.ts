import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'sidewalk icetea', // Chỉ định thư mục
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
          return result;
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}

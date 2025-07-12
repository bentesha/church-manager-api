import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { Config } from 'src/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImageService {
  private readonly minioClient: Client;
  private readonly bucketName = 'images';

  constructor(private readonly config: Config) {
    this.minioClient = new Client({
      endPoint: this.config.minio.endPoint,
      port: this.config.minio.port,
      useSSL: false,
      accessKey: this.config.minio.accessKey,
      secretKey: this.config.minio.secretKey,
    });

    this.initializeBucket();
  }

  private async initializeBucket(): Promise<void> {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName);
      }
    } catch (error) {
      console.log(error)
      console.error(`Failed to initialize bucket: ${error.message}`);
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      return fileName;
    } catch (error) {
      console.log(error)
      throw new Error('Failed to upload image');
    }
  }

  async getImageUrl(fileName: string): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        fileName,
        7 * 24 * 60 * 60, // 7 days
      );
    } catch (error) {
      console.log(error)
      throw new Error('Failed to get image URL');
    }
  }

  async getImageStream(fileName: string): Promise<{ stream: any; contentType: string }> {
    try {
      const stream = await this.minioClient.getObject(this.bucketName, fileName);
      const stat = await this.minioClient.statObject(this.bucketName, fileName);
      
      return {
        stream,
        contentType: stat.metaData['content-type'] || 'application/octet-stream',
      };
    } catch (error) {
      throw new Error('Failed to get image');
    }
  }

  async deleteImage(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, fileName);
    } catch (error) {
      console.log(error)
      throw new Error('Failed to delete image');
    }
  }

  extractFileNameFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const bucketPrefix = `/${this.bucketName}/`;
      
      if (pathname.startsWith(bucketPrefix)) {
        return pathname.substring(bucketPrefix.length);
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
}
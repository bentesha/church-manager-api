import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Check } from 'src/decoractors/check.decorator';
import { CheckGuard } from 'src/guards/check.guard';
import { ImageService } from 'src/common/services/image.service';

@Controller('image')
@UseGuards(CheckGuard)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('/upload')
  @Check('image.upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed',
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB');
    }

    const filename = await this.imageService.uploadImage(file);

    return {
      filename,
    };
  }

  @Get('/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const { stream, contentType } =
        await this.imageService.getImageStream(filename);

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache

      stream.pipe(res);
    } catch (error) {
      res.status(404).json({ message: 'Image not found' });
    }
  }
}

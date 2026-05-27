import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary if keys are provided
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isCloudinaryConfigured) {
      // Stream buffer directly to Cloudinary
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'ragaartspace_uploads' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });

      return NextResponse.json({ imageUrl: uploadResult.secure_url });
    } else {
      // Fallback: local disk storage for local dev when Cloudinary is not configured
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const timestamp = Date.now();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const uniqueFileName = `${timestamp}_${cleanFileName}`;
      const filePath = join(uploadDir, uniqueFileName);

      await writeFile(filePath, buffer);

      return NextResponse.json({ imageUrl: `/uploads/${uniqueFileName}` });
    }
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

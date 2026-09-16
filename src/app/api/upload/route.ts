import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in form data' },
        { status: 400 }
      );
    }

    // Validate size (max 25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File exceeds maximum 25MB limit' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || 'application/octet-stream';

    const result = await uploadToS3({
      fileBuffer: buffer,
      fileName: file.name,
      contentType,
    });

    // Save local copy to public/ directory so previews and localhost always load reliably
    try {
      const localFilePath = path.join(process.cwd(), 'public', result.key);
      await fs.mkdir(path.dirname(localFilePath), { recursive: true });
      await fs.writeFile(localFilePath, buffer);
    } catch (saveErr) {
      console.warn('Local cache write note:', saveErr);
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      size: result.size,
      name: file.name,
    });
  } catch (error: any) {
    console.error('API Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'File upload failed',
      },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getObjectFromS3 } from '@/lib/s3';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await context.params;
    if (!key || key.length === 0) {
      return new NextResponse('Key not found', { status: 400 });
    }

    const fullKey = key.join('/');

    // 1. First attempt to fetch directly from S3 via SigV4
    try {
      const object = await getObjectFromS3(fullKey);
      if (object) {
        return new NextResponse(new Uint8Array(object.buffer), {
          headers: {
            'Content-Type': object.contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (s3Err) {
      console.warn('S3 proxy fetch warning, trying local cache:', s3Err);
    }

    // 2. Fallback: Check local disk storage in public/ directory
    try {
      const localFilePath = path.join(process.cwd(), 'public', fullKey);
      const fileBuffer = await fs.readFile(localFilePath);
      const ext = path.extname(fullKey).toLowerCase();
      let mimeType = 'image/jpeg';
      if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.webp') mimeType = 'image/webp';
      else if (ext === '.svg') mimeType = 'image/svg+xml';
      else if (ext === '.gif') mimeType = 'image/gif';

      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch {
      // Not found locally
    }

    return new NextResponse('Object not found or access denied', { status: 404 });
  } catch (error: any) {
    console.error('Media proxy error:', error);
    return new NextResponse(error.message || 'Internal error', { status: 500 });
  }
}


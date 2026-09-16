import crypto from 'crypto';

export interface S3UploadResult {
  url: string;
  key: string;
  size: number;
}

/**
 * Upload a file directly to AWS S3 using native AWS Signature Version 4.
 * Does not require external packages (@aws-sdk), 100% self-contained and secure.
 */
export async function uploadToS3({
  fileBuffer,
  fileName,
  contentType,
}: {
  fileBuffer: Buffer;
  fileName: string;
  contentType: string;
}): Promise<S3UploadResult> {
  const accessKeyId =
    process.env.AWS_ACCESS_KEY_ID ||
    process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
    '';
  const secretAccessKey =
    process.env.AWS_SECRET_ACCESS_KEY ||
    process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ||
    '';
  const region =
    process.env.AWS_REGION ||
    process.env.AWS_DEFAULT_REGION ||
    process.env.NEXT_PUBLIC_AWS_REGION ||
    'ap-southeast-2';
  const bucket =
    process.env.AWS_S3_BUCKET_NAME ||
    process.env.S3_BUCKET_NAME ||
    process.env.AWS_BUCKET_NAME ||
    process.env.AWS_S3_BUCKET ||
    process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME ||
    process.env.NEXT_PUBLIC_S3_BUCKET_NAME ||
    '';

  if (!accessKeyId || !secretAccessKey || !bucket) {
    throw new Error(
      `AWS S3 configuration missing. Please verify in .env.local: AWS_ACCESS_KEY_ID (${accessKeyId ? '✓' : '✗'}), AWS_SECRET_ACCESS_KEY (${secretAccessKey ? '✓' : '✗'}), AWS_S3_BUCKET_NAME (${bucket ? '✓' : '✗'})`
    );
  }

  // Sanitize filename and create unique key
  const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `uploads/${Date.now()}-${sanitized}`;

  // AWS S3 endpoint
  const host =
    region === 'us-east-1'
      ? `${bucket}.s3.amazonaws.com`
      : `${bucket}.s3.${region}.amazonaws.com`;
  const endpoint = `https://${host}/${key}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);

  const payloadHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  const canonicalUri = `/${encodeURI(key)}`;
  const canonicalQuery = '';
  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n');

  const kDate = crypto.createHmac('sha256', 'AWS4' + secretAccessKey).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
  const kService = crypto.createHmac('sha256', kRegion).update('s3').digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Host': host,
      'Content-Type': contentType,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': payloadHash,
      'Authorization': authorizationHeader,
    },
    body: new Uint8Array(fileBuffer),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `S3 PutObject error (${response.status}): ${errorBody || response.statusText}`
    );
  }

  const cloudfrontDomain =
    process.env.CLOUDFRONT_DOMAIN ||
    process.env.AWS_CLOUDFRONT_DOMAIN ||
    process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN ||
    '';

  const cleanCloudfront = cloudfrontDomain
    ? cloudfrontDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : '';

  const publicUrl = cleanCloudfront ? `https://${cleanCloudfront}/${key}` : endpoint;

  return {
    url: publicUrl,
    key,
    size: fileBuffer.length,
  };
}

/**
 * Resolves an S3 asset URL or key to its CloudFront CDN URL when configured.
 */
export function resolveAssetUrl(urlOrKey: string): string {
  if (!urlOrKey) return '';
  const cloudfrontDomain =
    process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN ||
    process.env.CLOUDFRONT_DOMAIN ||
    process.env.AWS_CLOUDFRONT_DOMAIN ||
    '';
  if (!cloudfrontDomain) return urlOrKey;

  const cleanDomain = cloudfrontDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (urlOrKey.includes(cleanDomain)) return urlOrKey;

  if (urlOrKey.includes('.amazonaws.com/')) {
    const key = urlOrKey.split('.amazonaws.com/')[1];
    if (key) return `https://${cleanDomain}/${key}`;
  }

  if (urlOrKey.startsWith('uploads/')) {
    return `https://${cleanDomain}/${urlOrKey}`;
  }

  return urlOrKey;
}


/**
 * Fetch an object directly from S3 using AWS Signature Version 4.
 * Allows serving private/protected S3 assets securely via Next.js proxy.
 */
export async function getObjectFromS3(
  key: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const accessKeyId =
    process.env.AWS_ACCESS_KEY_ID ||
    process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
    '';
  const secretAccessKey =
    process.env.AWS_SECRET_ACCESS_KEY ||
    process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ||
    '';
  const region =
    process.env.AWS_REGION ||
    process.env.AWS_DEFAULT_REGION ||
    process.env.NEXT_PUBLIC_AWS_REGION ||
    'ap-southeast-2';
  const bucket =
    process.env.AWS_S3_BUCKET_NAME ||
    process.env.S3_BUCKET_NAME ||
    process.env.AWS_BUCKET_NAME ||
    process.env.AWS_S3_BUCKET ||
    process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME ||
    process.env.NEXT_PUBLIC_S3_BUCKET_NAME ||
    '';

  if (!accessKeyId || !secretAccessKey || !bucket) return null;

  const host =
    region === 'us-east-1'
      ? `${bucket}.s3.amazonaws.com`
      : `${bucket}.s3.${region}.amazonaws.com`;
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  const endpoint = `https://${host}/${encodeURI(cleanKey)}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);
  const payloadHash = crypto.createHash('sha256').update('').digest('hex');

  const canonicalUri = `/${encodeURI(cleanKey)}`;
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = [
    'GET',
    canonicalUri,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n');

  const kDate = crypto.createHmac('sha256', 'AWS4' + secretAccessKey).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
  const kService = crypto.createHmac('sha256', kRegion).update('s3').digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Host': host,
        'x-amz-date': amzDate,
        'x-amz-content-sha256': payloadHash,
        'Authorization': authorizationHeader,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`S3 GetObject failed (${res.status}):`, errText);
      return null;
    }
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await res.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      contentType,
    };
  } catch (e) {
    console.error('S3 GetObject fetch error:', e);
    return null;
  }
}

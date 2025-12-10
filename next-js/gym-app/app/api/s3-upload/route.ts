import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

if (!process.env.AWS_S3_REGION || 
    !process.env.AWS_S3_ACCESS_KEY_ID || 
    !process.env.AWS_S3_SECRET_ACCESS_KEY) {
  throw new Error("Missing AWS S3 environment variables");
}

const s3ClientInstance = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  }
});

export async function POST(req: Request) {

  const formData = await req.formData();
  const file = (formData.get('profile_picture') as File);
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name, file.type);
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
    return NextResponse.json({ success: true, data: { key: fileName, url: fileUrl } });

  } catch (error) {
    throw new Error(`Couldn't upload file to S3. ${error}`)
  }
}

async function uploadFileToS3(buffer: Buffer, fileName: string, fileType: string) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: fileType
  };
  const command = new PutObjectCommand(params);
  await s3ClientInstance.send(command);
  return fileName;
}
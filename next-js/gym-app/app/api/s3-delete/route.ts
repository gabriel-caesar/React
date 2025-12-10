'use server'

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

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
})

export async function POST(req: Request) {
  const { key } = await req.json();
  try {
    s3ClientInstance.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key
      })
    )
    return NextResponse.json({ success: true });
  } catch (error) {
    throw new Error(`Couldn't delete S3 image. ${error}`);
  }
}
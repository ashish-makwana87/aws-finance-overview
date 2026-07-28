import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { profileService } from "../services/profileService.js";
import { logger } from "../utils/logger.js";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const processRecord = async (record) => {

  const { bucket, key, userId } = JSON.parse(record.body);

  const avatarKey = key.replace("avatars/original/", "");

  logger.info({
    event: "IMAGE_PROCESSING_STARTED",
    message: "Started processing uploaded image",
    service: "image-resize-handler",
    metadata: {
      bucket,
      key,
    },
  });

  if (!key.startsWith("avatars/original/")) {
    return;
  }

  try {
    const image = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );

    const buffer = Buffer.from(await image.Body.transformToByteArray());

    // resizing and compression
    const optimized = await sharp(buffer)
      .resize(256, 256, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 80 })
      .toBuffer();

    const optimizedKey = `avatars/optimized/${avatarKey}.webp`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: optimizedKey,
        Body: optimized,
        ContentType: "image/webp",
      }),
    );

    await profileService.updateAvatarKey(userId, avatarKey);

    logger.info({
      event: "IMAGE_RESIZED",
      message: "Image resized successfully",
      service: "image-resize-handler",
      metadata: {
        bucket,
        originalKey: key,
        optimizedKey,
        userId,
      },
    });
  } catch (error) {
    logger.error({
      event: "IMAGE_RESIZE_FAILED",
      message: "Image resize failed",
      service: "image-resize-handler",
      metadata: {
        bucket,
        key,
        error: error.message,
        stack: error.stack,
      },
    });

    throw error;
  }
};

export const handler = async (event) => {
  for (const record of event.Records) {
    await processRecord(record);
  }
};

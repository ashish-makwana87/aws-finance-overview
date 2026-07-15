import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { profileService } from "../services/profileService.js";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const processRecord = async (record) => {
  const s3Event = JSON.parse(record.body);
  const s3Record = s3Event.Records[0];

  const bucket = s3Record.s3.bucket.name;
  const key = decodeURIComponent(s3Record.s3.object.key);

  const avatarKey = key.replace("avatars/original/", "");
  const [userId] = avatarKey.split("-");

  console.log("Processing image", {
    bucket,
    key,
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

    console.log("Image processed successfully", {
      bucket,
      originalKey: key,
      optimizedKey,
      userId,
    });
  } catch (error) {
    // For cloud Watch log details.
    console.error("Image processing failed", {
      bucket,
      key,
      error: error.message,
      stack: error.stack,
    });

    throw error;
  }
};

export const handler = async (event) => {
  for (const record of event.Records) {
    await processRecord(record);
  }
};

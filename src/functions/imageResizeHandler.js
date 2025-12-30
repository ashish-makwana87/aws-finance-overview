import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key);

    if (!key.startsWith("avatars/original/")) continue;

    const image = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );

    const buffer = Buffer.from(await image.Body.transformToByteArray());

    const optimized = await sharp(buffer)
      .resize(256, 256, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 80 })
      .toBuffer();

    const optimizedKey = key
      .replace("avatars/original/", "avatars/optimized/")
      .concat(".webp");

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: optimizedKey,
        Body: optimized,
        ContentType: "image/webp",
      })
    );
  }
};

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler = async (event) => {
  console.log("Lambda triggered");
  console.log("Received records:", event.Records?.length);

  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key);

    console.log("Processing object");
    console.log("Bucket:", bucket);
    console.log("Key:", key);

    if (!key.startsWith("avatars/original/")) {
      console.log("Skipping non-avatar object");
      continue;
    }

    try {
      console.log("Downloading image from S3");

      const image = await s3.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
      );

      const buffer = Buffer.from(await image.Body.transformToByteArray());

      console.log("Image downloaded. Size (bytes):", buffer.length);
      console.log("Starting image resize with Sharp");

      // resizing and compression
      const optimized = await sharp(buffer)
        .resize(256, 256, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: 80 })
        .toBuffer();

      console.log(
        "Image resized successfully. Optimized size (bytes):",
        optimized.length
      );

      const optimizedKey = key
        .replace("avatars/original/", "avatars/optimized/")
        .concat(".webp");

      console.log("Uploading optimized image to:", optimizedKey);

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: optimizedKey,
          Body: optimized,
          ContentType: "image/webp",
        })
      );

      console.log("Optimized image upload completed");
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  }
};

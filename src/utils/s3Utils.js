import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const generateUploadURL = async ({ key, contentType }) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AVATAR_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3, command, { expiresIn: 60 });
};

export const deleteAvatarObjects = async (avatarKey) => {
  if (!avatarKey) return;

  const originalKey = `avatars/original/${avatarKey}`;
  const optimizedKey = `avatars/optimized/${avatarKey}.webp`;

  const deleteCommands = [
    new DeleteObjectCommand({
      Bucket: process.env.AVATAR_BUCKET,
      Key: originalKey,
    }),
    new DeleteObjectCommand({
      Bucket: process.env.AVATAR_BUCKET,
      Key: optimizedKey,
    }),
  ];

  // Does not throw error if one fails to execute
  await Promise.allSettled(
    deleteCommands.map((cmd) => s3.send(cmd))
  );
};

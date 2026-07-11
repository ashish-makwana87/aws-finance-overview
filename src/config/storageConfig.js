
export const storageConfig = {
 provider: process.env.STORAGE_PROVIDER || "s3",
 avatar: {
  bucket: process.env.AVATAR_BUCKET,
  maxSizeMB: Number(process.env.AVATAR_MAX_SIZE_MB) || 5,
  allowedTypes: (process.env.AVATAR_ALLOWED_TYPES || "").split(",")
 }
}



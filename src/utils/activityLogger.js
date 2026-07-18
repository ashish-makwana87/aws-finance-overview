import { profileUpdateLogRepository } from "../repositories/profileUpdateLogRepository.js";
import { logger } from "../utils/logger.js";

export const activityLogger = {
  logProfileUpdate: async ({ userId, updatedFields }) => {
    const logEntry = {
      event: "PROFILE_UPDATED",
      userId,
      updatedFields,
      timestamp: new Date(),
    };

    // CloudWatch log
    logger.info({
      event: "ACTIVITY_LOG_CREATED",
      message: "Activity log created",
      service: "activity-logger",
      metadata: logEntry,
    });

    // DB collection
    await profileUpdateLogRepository.create(logEntry);
  },

  logAvatarUploadInitiated: async ({ userId, avatarKey }) => {
    const logEntry = {
      event: "AVATAR_UPLOAD_INITIATED",
      userId,
      avatarKey,
      timestamp: new Date(),
    };

    // CloudWatch log
    logger.info({
      event: "ACTIVITY_LOG_CREATED",
      message: "Activity log created",
      service: "activity-logger",
      metadata: logEntry,
    });

    // DB collection
    await profileUpdateLogRepository.create(logEntry);
  },

  logAvatarDeleted: async ({ userId, oldAvatarKey }) => {
    const logEntry = {
      event: "PREV_AVATAR_DELETED",
      userId,
      oldAvatarKey,
      timestamp: new Date(),
    };

    // CloudWatch log
    logger.info({
      event: "ACTIVITY_LOG_CREATED",
      message: "Activity log created",
      service: "activity-logger",
      metadata: logEntry,
    });

    // DB collection
    await profileUpdateLogRepository.create(logEntry);
  },
};

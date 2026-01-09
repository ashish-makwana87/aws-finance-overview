import { userProfileModel } from "../../src/models/userProfileModel.js";
import { userProfileRepository } from "../../src/repositories/userProfileRepository.js";
import { profileService } from "../../src/services/profileService.js";
import { activityLogger } from "../../src/utils/activityLogger.js";
import { deleteAvatarObjects } from "../../src/utils/s3Utils.js";

activityLogger

jest.mock("../../src/repositories/userProfileRepository.js");
jest.mock("../../src/models/userProfileModel.js", () => ({
  userProfileModel: {
    defaultProfile: jest.fn(),
  },
}));

jest.mock("../../src/utils/s3Utils.js");

describe("profileService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

// ===========================
//  getProfile test
// ===========================

  describe("getProfile", () => {
    it("returns existing profile if found", async () => {
      const userId = "user-1";
      const profile = { userId, firstName: "Ashish" };

      userProfileRepository.findByUserId.mockResolvedValue(profile);

      const result = await profileService.getProfile(userId);

      expect(userProfileRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(userProfileRepository.create).not.toHaveBeenCalled();
      expect(result).toEqual(profile);
    });

    it("creates and returns default profile if not found", async () => {
      const userId = "user-2";
      const defaultProfile = { userId };

      userProfileRepository.findByUserId.mockResolvedValue(null);
      userProfileModel.defaultProfile.mockReturnValue(defaultProfile);

      const result = await profileService.getProfile(userId);

      expect(userProfileModel.defaultProfile).toHaveBeenCalledWith(userId);
      expect(userProfileRepository.create).toHaveBeenCalledWith(defaultProfile);
      expect(result).toEqual(defaultProfile);
    });
  });

// ===========================
//  updateProfile test
// ===========================

 
  describe("updateProfile", () => {
    it("updates profile and logs updated fields", async () => {
      const userId = "user-3";
      const data = { firstName: "Ashish", phone: "123" };

      userProfileRepository.update.mockResolvedValue({});
      activityLogger.logProfileUpdate.mockResolvedValue();

      const result = await profileService.updateProfile(userId, data);

      expect(userProfileRepository.update)
        .toHaveBeenCalledWith(userId, data);

      expect(activityLogger.logProfileUpdate)
        .toHaveBeenCalledWith({
          userId,
          updatedFields: ["firstName", "phone"],
        });

      expect(result).toEqual({ message: "Profile updated" });
    });
  });


// ===========================
//  deleteProfile test
// ===========================

  
  describe("deleteProfile", () => {
    it("deletes profile", async () => {
      const userId = "user-4";

      userProfileRepository.delete.mockResolvedValue({});

      const result = await profileService.deleteProfile(userId);

      expect(userProfileRepository.delete).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ message: "Profile deleted" });
    });
  });

// ===========================
//  updateAvatarKey test
// ===========================
  

  describe("updateAvatarKey", () => {
    it("updates avatar key when valid inputs are provided", async () => {
      const userId = "user-5";
      const avatarKey = "avatar-123";

      userProfileRepository.updateAvatarKey.mockResolvedValue({});

      await profileService.updateAvatarKey(userId, avatarKey);

      expect(userProfileRepository.updateAvatarKey)
        .toHaveBeenCalledWith(userId, avatarKey);
    });

    it("does nothing when userId or avatarKey is missing", async () => {
      await profileService.updateAvatarKey(null, null);

      expect(userProfileRepository.updateAvatarKey).not.toHaveBeenCalled();
    });
  });

// ===========================
//  cleanupOldAvatar test
// ===========================

describe("cleanupOldAvatar", () => {
    it("deletes old avatar and logs deletion", async () => {
      const userId = "user-6";
      const profile = { avatarKey: "old-avatar" };

      userProfileRepository.findByUserId.mockResolvedValue(profile);
      deleteAvatarObjects.mockResolvedValue();
      activityLogger.logAvatarDeleted.mockResolvedValue();

      await profileService.cleanupOldAvatar(userId);

      expect(deleteAvatarObjects)
        .toHaveBeenCalledWith("old-avatar");

      expect(activityLogger.logAvatarDeleted)
        .toHaveBeenCalledWith({
          userId,
          oldAvatarKey: "old-avatar",
        });
    });

    it("does nothing if profile does not exist", async () => {
      userProfileRepository.findByUserId.mockResolvedValue(null);

      await profileService.cleanupOldAvatar("user-7");

      expect(deleteAvatarObjects).not.toHaveBeenCalled();
      expect(activityLogger.logAvatarDeleted).not.toHaveBeenCalled();
    });

    it("does nothing if profile has no avatarKey", async () => {
      userProfileRepository.findByUserId.mockResolvedValue({});

      await profileService.cleanupOldAvatar("user-8");

      expect(deleteAvatarObjects).not.toHaveBeenCalled();
      expect(activityLogger.logAvatarDeleted).not.toHaveBeenCalled();
    });
  });
});
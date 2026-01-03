export const userProfileModel = {
  defaultProfile: (userId) => ({
    userId,
    firstName: "",
    lastName: "",
    phone: "",
    avatarKey: null,
    address: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};



export const userProfileModel = {

 defaultProfile: (userId) => ({
    userId,
    firstName: "",
    lastName: "",
    phone: "",
    avatar: "",
    address: "", 
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};

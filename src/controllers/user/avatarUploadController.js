import { fileService } from "../../services/fileService.js";
import { success } from "../../utils/response.js";

export const getAvatarUploadURLController = async (event) => {
  
  const userId = event.user.id;
  const body = JSON.parse(event.body);

  const result = await fileService.createAvatarUpload(
    userId,
    body.fileType
  );

  return success(result);
};

import { Router } from "express";
import {
  GetUserDetails,
  UpdateUserDetails,
  UploadProfilePicture,
  UserLogout,
} from "../../Controllers/userController/userController.js";
const router = Router();

router.get("/get-details", GetUserDetails);
router.put("/update-details", UpdateUserDetails);
router.get("/logout", UserLogout);
router.post("/upload-profile", UploadProfilePicture);

export default router;

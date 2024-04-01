import { Router } from "express";
import {
  LoginUser,
  RegisterUser,
} from "../../Controllers/userController/userController.js";
const router = Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);

export default router;

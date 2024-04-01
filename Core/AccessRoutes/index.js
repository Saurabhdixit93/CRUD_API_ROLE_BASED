import { Router } from "express";
const router = Router();
import authRoutes from "./Users/Authentication.js";
import userRoutes from "./Users/Users.js";
import courseRoutes from "./Courses/courses.js";
import courseEnrollmentRoutes from "./Users/CourseEnrollment.js";
import { ValidateAuthUser } from "../AccessControl/authValidation.js";
import { roleMiddleware } from "../AccessControl/RoleValidations.js";

router.use("/auth", authRoutes);
router.use("/user", ValidateAuthUser, userRoutes);
router.use("/course-enrollment", ValidateAuthUser, courseEnrollmentRoutes);

// only for super admin users
router.use(
  "/course",
  ValidateAuthUser,
  roleMiddleware(["SUPER-ADMIN"]),
  courseRoutes
);

export default router;

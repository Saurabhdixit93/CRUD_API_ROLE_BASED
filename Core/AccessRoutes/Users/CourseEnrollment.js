import { Router } from "express";
import { ValidateAuthUser } from "../../AccessControl/authValidation.js";
import {
  EnrollNewCourse,
  UnenrollCourse,
  ViewEnrolledCourses,
  ViewSingleEnrolledCourse,
} from "../../Controllers/userController/CourseEnrollment.js";

const router = Router();

router.post("/enroll-course/:courseId", EnrollNewCourse);
router.post("/unenroll-course/:courseId", UnenrollCourse);
router.get("/view-enrolled-courses", ViewEnrolledCourses);
router.get("/view-single-enrolled-course/:courseId", ViewSingleEnrolledCourse);

export default router;

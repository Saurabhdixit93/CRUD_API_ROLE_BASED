import { Router } from "express";
import {
  CreateCourse,
  UpdateCourse,
  GetAllCourses,
  GetSingleCourse,
  RemoveCourse,
} from "../../Controllers/courseController/courseController.js";

const router = Router();

router.post("/add-course", CreateCourse);
router.put("/update-course/:courseId", UpdateCourse);
router.get("/get-courses", GetAllCourses);
router.get("/get-course/:courseId", GetSingleCourse);
router.delete("/remove-course/:courseId", RemoveCourse);

export default router;

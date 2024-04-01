import { CourseModel } from "../../Database/databaseModels/CourseModel/courseModel.js";
import userModel from "../../Database/databaseModels/UsersModel/userModel.js";
import { RESEND_EMAIL } from "../../../Services/EmailService/Resend.config.js";

// Create Course
export const CreateCourse = async (req, res) => {
  const userId = req.userId;
  const {
    courseName,
    courseDescription,
    courseLevel,
    courseCategory,
    coursePrice,
    courseDuration,
  } = req.body;

  if (
    !courseName ||
    !courseDescription ||
    !courseLevel ||
    !courseCategory ||
    !coursePrice ||
    !courseDuration
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required", status: false });
  }
  try {
    const isSuperAdmin = await userModel.findById(userId);
    const superAdminRole = isSuperAdmin.role === "SUPER-ADMIN";

    if (!superAdminRole || !isSuperAdmin) {
      return res.status(400).json({ message: "Unauthorized", status: false });
    }

    const addCourse = new CourseModel({
      courseName,
      courseDescription,
      courseLevel,
      courseCategory,
      coursePrice,
      courseDuration,
    });

    addCourse.save().then(async () => {
      await RESEND_EMAIL.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: isSuperAdmin.email,
        subject: "Course Created Successfully",
        html: "<p>Congrats on creating a new course!</p>",
      });
    });

    return res
      .status(200)
      .json({ message: "Course created successfully", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get All Courses
export const GetAllCourses = async (req, res) => {
  const userId = req.userId;
  const { page, limit = 10, category, level } = req.query;

  // Fetch courses based on filtering options
  let query = {};
  if (category) {
    query.courseCategory = category;
  }
  if (level) {
    query.courseLevel = level;
  }

  try {
    const isSuperAdmin = await userModel.findById(userId);
    const superAdminRole = isSuperAdmin.role === "SUPER-ADMIN";

    if (!superAdminRole || !isSuperAdmin) {
      return res.status(400).json({ message: "Unauthorized", status: false });
    }

    const coursesCount = await CourseModel.countDocuments(query);

    const courses = await CourseModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    if (!courses || courses.length === 0) {
      return res
        .status(400)
        .json({ message: "No courses found", status: false });
    }

    const totalPages = Math.ceil(coursesCount / limit);

    return res.status(200).json({ data: courses, status: true, totalPages });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Single Course
export const GetSingleCourse = async (req, res) => {
  const userId = req.userId;
  const courseId = req.params.courseId;

  try {
    const isSuperAdmin = await userModel.findById(userId);
    const superAdminRole = isSuperAdmin.role === "SUPER-ADMIN";

    if (!superAdminRole || !isSuperAdmin) {
      return res.status(400).json({ message: "Unauthorized", status: false });
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res
        .status(400)
        .json({ message: "Course not found", status: false });
    }

    return res.status(200).json({ data: course, status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update Course
export const UpdateCourse = async (req, res) => {
  const userId = req.userId;
  const courseId = req.params.courseId;

  const {
    courseName,
    courseDescription,
    courseLevel,
    courseCategory,
    coursePrice,
    courseDuration,
  } = req.body;

  try {
    const isSuperAdmin = await userModel.findById(userId);
    const superAdminRole = isSuperAdmin.role === "SUPER-ADMIN";

    if (!superAdminRole || !isSuperAdmin) {
      return res.status(400).json({ message: "Unauthorized", status: false });
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res
        .status(400)
        .json({ message: "Course not found", status: false });
    }

    // Construct update object based on the presence of specific fields
    const courseObject = {};
    if (courseName) courseObject.courseName = courseName;
    if (courseDescription) courseObject.courseDescription = courseDescription;
    if (courseLevel) courseObject.courseLevel = courseLevel;
    if (courseCategory) courseObject.courseCategory = courseCategory;
    if (coursePrice) courseObject.coursePrice = coursePrice;
    if (courseDuration) courseObject.courseDuration = courseDuration;

    await CourseModel.findByIdAndUpdate(
      courseId,
      { $set: courseObject },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: " Course updated successfully ", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// remove course
export const RemoveCourse = async (req, res) => {
  const userId = req.userId;
  const courseId = req.params.courseId;

  try {
    const isSuperAdmin = await userModel.findById(userId);
    const superAdminRole = isSuperAdmin.role === "SUPER-ADMIN";

    if (!superAdminRole || !isSuperAdmin) {
      return res.status(400).json({ message: "Unauthorized", status: false });
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res
        .status(400)
        .json({ message: "Course not found", status: false });
    }

    // Remove the course ID from the enrolledCourses array of all users who are enrolled in the course
    await userModel.updateMany(
      { enrolledCourses: courseId },
      { $pull: { enrolledCourses: courseId } }
    );

    CourseModel.findByIdAndDelete(courseId).then(async () => {
      await RESEND_EMAIL.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: course.email,
        subject: "Course Removed Successfully",
        html: "<p>Congrats on removing your course!</p>",
      });
    });

    //   also remove course id from user enrolled courses array if enrolled

    return res
      .status(200)
      .json({ message: "Course Removed successfully", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

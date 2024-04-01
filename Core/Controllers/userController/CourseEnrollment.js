import { CourseModel } from "../../Database/databaseModels/CourseModel/courseModel.js";
import userModel from "../../Database/databaseModels/UsersModel/userModel.js";
import { RESEND_EMAIL } from "../../../Services/EmailService/Resend.config.js";

import mongoose, { Types } from "mongoose";

// Enroll New Course
export const EnrollNewCourse = async (req, res) => {
  const userId = req.userId;
  const courseId = req.params.courseId;

  try {
    const isUserExist = await userModel.findById(userId);
    if (!isUserExist) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isCourseExist = await CourseModel.findById(courseId);
    if (!isCourseExist) {
      return res.status(400).json({ message: "Course does not exist" });
    }

    //   check that course is not already enrolled
    if (isUserExist.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: "Course already enrolled", status: false });
    }

    //    add couse id to user enrolled courses array
    isUserExist.enrolledCourses.push(courseId);

    // Increase courseUsersCounts by 1
    isCourseExist.courseEnrolledUsers++;

    //   check if course count is greater than 5 make it popular true
    if (isCourseExist.courseEnrolledUsers >= 5) {
      isCourseExist.isCoursePopular = true;
    }

    // Save the changes to both user and course
    await Promise.all([isUserExist.save(), isCourseExist.save()]);

    // Send enrollment success email
    await RESEND_EMAIL.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: isUserExist.email,
      subject: "Course Enrolled Successfully",
      html: "<p>Congrats on enrolling your course!</p>",
    });

    return res.status(200).json({
      message: "Course enrolled successfully",
      status: true,
      isUserExist,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Unenroll Course
export const UnenrollCourse = async (req, res) => {
  const userId = req.userId;
  const courseId = req.params.courseId;

  try {
    const isUserExist = await userModel.findById(userId);
    if (!isUserExist) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isCourseExist = await CourseModel.findById(courseId);
    if (!isCourseExist) {
      return res.status(400).json({ message: "Course does not exist" });
    }

    //   check course enrolled or not if enrolled then remove course id from user enrolled courses array

    if (!isUserExist.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: "Course not enrolled", status: false });
    }

    //    remove couse id from user enrolled courses array
    const courseIdObj = new mongoose.Types.ObjectId(courseId);

    // Filter out the course with matching ID
    isUserExist.enrolledCourses = isUserExist.enrolledCourses.filter(
      (course) => !course._id.equals(courseIdObj)
    );

    // Decrease courseUsersCounts by 1
    isCourseExist.courseEnrolledUsers--;

    // Save the changes to both user and course
    await Promise.all([user.save(), isCourseExist.save()]);

    // Send unenrollment success email
    await RESEND_EMAIL.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: user.email,
      subject: "Course Unenrolled Successfully",
      html: "<p>You have successfully unenrolled from the course.</p>",
    });

    return res.status(200).json({
      message: "Course unenrolled successfully",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// view all enrolled courses
export const ViewEnrolledCourses = async (req, res) => {
  const userId = req.userId;
  const { page = 1, limit = 10, category, level } = req.query;

  try {
    const isUserExist = await userModel.findById(userId);
    if (!isUserExist) {
      return res.status(400).json({ message: "User does not exist" });
    }

    let query = { _id: { $in: isUserExist.enrolledCourses } };

    // Apply filtering based on category and level
    if (category) {
      query.courseCategory = category;
    }
    if (level) {
      query.courseLevel = level;
    }

    // const enrolledCourses = await CourseModel.find({
    //   _id: { $in: isUserExist.enrolledCourses },
    // });

    // if (!enrolledCourses || enrolledCourses.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ message: "No courses found", status: false });
    // }

    // return res.status(200).json({ data: enrolledCourses, status: true });

    // Count total number of enrolled courses
    const totalCount = await CourseModel.countDocuments(query);

    // Apply pagination
    const enrolledCourses = await CourseModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    if (!enrolledCourses || enrolledCourses.length === 0) {
      return res
        .status(400)
        .json({ message: "No courses found", status: false });
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    return res
      .status(200)
      .json({ data: enrolledCourses, status: true, totalPages });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// view single enrolled course
export const ViewSingleEnrolledCourse = async (req, res) => {
  const userId = req.userId;
  const courseId = req.params.courseId;

  try {
    const isUserExist = await userModel.findById(userId);
    if (!isUserExist) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isCourseExist = await CourseModel.findById(courseId);

    if (!isCourseExist) {
      return res.status(400).json({ message: "Course does not exist" });
    }

    const isCourseEnrolled = isUserExist.enrolledCourses.includes(courseId);

    if (!isCourseEnrolled) {
      return res
        .status(400)
        .json({ message: "Course not enrolled", status: false });
    }

    return res.status(200).json({ data: isCourseExist, status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

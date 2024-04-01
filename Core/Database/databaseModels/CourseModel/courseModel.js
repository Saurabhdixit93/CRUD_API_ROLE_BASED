import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseDescription: {
      type: String,
      required: true,
    },
    courseLevel: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: "BEGINNER",
      required: true,
    },
    courseCategory: {
      type: String,
      required: true,
    },
    coursePrice: {
      type: String,
      required: true,
    },
    courseDuration: {
      type: String,
      required: true,
    },
    isCoursePopular: {
      type: Boolean,
      default: false,
    },
    courseEnrolledUsers: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const CourseModel = model("Course", courseSchema);

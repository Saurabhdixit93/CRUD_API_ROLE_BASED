import userModel from "../../Database/databaseModels/UsersModel/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RESEND_EMAIL } from "../../../Services/EmailService/Resend.config.js";
import cloudinaryV2 from "../../../Services/ProfileServices/profileServices.js";

// Register User
export const RegisterUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userRole = req.query.roleType;
  const rolesArray = ["SUPER-ADMIN", "USER"];

  if (userRole) {
    if (!rolesArray.includes(userRole)) {
      return res.status(400).json({ message: "Invalid user role" });
    }
  }
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }

  try {
    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(18);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    newUser.save().then(async () => {
      const email = newUser.email;
      await RESEND_EMAIL.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: "Account Created Successfully",
        html: "<p>Congrats on creating your account!</p>",
      });
    });

    return res
      .status(200)
      .json({ message: "User created successfully", status: true, newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login User
export const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }

  try {
    const isExist = await userModel.findOne({ email });

    if (!isExist) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordMatched = await bcrypt.compare(password, isExist.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      userId: isExist._id,
      userRole: isExist.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d", // max 1d validity
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get User Details
export const GetUserDetails = async (req, res) => {
  const userId = req.userId;

  try {
    const isUserExist = await userModel.findById(userId).select("-password");
    if (!isUserExist) {
      return res.status(400).json({ message: "User does not exist" });
    }
    return res.status(200).json({
      data: isUserExist,
      status: true,
      message: "User details fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update User Details
export const UpdateUserDetails = async (req, res) => {
  const userId = req.userId;
  const { name, email } = req.body;

  try {
    const isUserExist = await userModel.findById(userId);
    if (!isUserExist) {
      return res.status(400).json({ message: "User does not exist" });
    }
    // Construct update object based on the presence of name and email
    const updateObject = {};
    if (name) updateObject.name = name;
    if (email) updateObject.email = email;

    userModel
      .findByIdAndUpdate(userId, { $set: updateObject }, { new: true })
      .then(async () => {
        await RESEND_EMAIL.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: email,
          subject: "Account Updated Successfully",
          html: "<p>Congrats on updating your account!</p>",
        });
      });
    return res
      .status(200)
      .json({ message: "User details updated successfully", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// User Logout function
export const UserLogout = async (req, res) => {
  const userId = req.userId;

  try {
    const isAccessTokenExist = await userModel.findById(userId);
    if (!isAccessTokenExist) {
      return res.status(400).json({ message: "User does not exist" });
    }
    delete req.userId;
    delete req.userRole;

    return res.status(200).json({ message: "Logout successful", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// upload profile picture
export const UploadProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload the profile image to Cloudinary
    const result = await cloudinaryV2.uploader.upload(req.file.path, {
      folder: "profile-images",
      public_id: `profile-image-${userId}`,
      width: 150,
      height: 150,
      crop: "fill",
      timestamp: Date.now(),
    });

    // Update user's profile picture URL in the database
    user.profilePicture = result.secure_url;
    await user.save();

    res.json({
      message: "Profile image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

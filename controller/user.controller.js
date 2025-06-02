import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      messsage: "All fields are required",
    });
  }
  try {
    const existionUser = await User.findOne({ email });
    if (existionUser) {
      return res.status(400).json({
        messsage: "User already exists!",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({
        messsage: "User not registerd!",
      });
    }
    console.log(user);

    const token = crypto.randomBytes(32).toString("hex");
    user.verficationToken = token;
    await user.save();
    //send email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.SENTERMAILE,
      to: user.email,
      subject: "Verify your email..",
      text: `Please click on the following link: ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
    };

    await transporter.sendMail(mailOption);

    res.status(201).json({
      messsage: "User registered successfully!",
      success: true,
    });
  } catch (error) {
    res.status(200).json({
      messsage: "User not register!",
      error,
      success: true,
    });
  }
};

const verifyUser = async (req, res) => {
  //get tolen from url
  //validate
  //find user based token
  //if not
  //set isVerified field to ture
  //remove verification token
  //save
  //return response
  const { token } = req.params;
  console.log(token);
  if (!token) {
    return res.status(400).json({
      messsage: "Invalid token!",
    });
  }
  const user = await User.findOne({ verficationToken: token });
  if (!user) {
    return res.status(400).json({
      messsage: "Invalid token!",
    });
  }
  user.isVerified = true;
  user.verficationToken = undefined;
  await user.save();
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required!",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password!",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      token,
      success: true,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "User not logged in!",
      error,
      success: false,
    });
  }
};

const getMe = async (req,res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if(!user) {
      return res.status(400).json({
        success: false,
        message: "User not fund!"
      });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    
  }
}

const logOutUser = async (req,res) => {
  try {
    res.cookie('token',' ',{});
    res.status(200).json({
      success: true,
      message: "Logout succesfully!"
    });
  } catch (error) {
    
  }
}

const forGetPassword = async (req,res) => {
  try {
    //get email
    //find user based on email
    //reset token + reset expiry => Date.now() + 10 * 60 * 1000 => user.save()
    //send email => design url
  } catch (error) {
    
  }
}

const resetPassword = async (req,res) => {
  //collect token from params
  //password from req.body
  const {token} = req.params;
  const {password} = req.body;
  try {
   const user = await User.findOne({
      resetPasswordToken: token,
      resetPassordExpires: {$gt: Date.now()}
    })
    //set password in user
  } catch (error) {
    
  }
}

export { registerUser, verifyUser, login,getMe,logOutUser,forGetPassword,resetPassword };

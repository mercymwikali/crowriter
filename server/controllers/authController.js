const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const registerUser = asyncHandler(async (req, res) => {
  const { fname, lname, email, password, role, profilePic, active } = req.body;
  if (!fname || !lname || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      fname,
      lname,
      email,
      password: hashedPassword,
      role,
      profilePic,
      active,
    },
  });

  if (user) {
    res.status(201).json({ message: `User ${user.fname} created successfully`, userId: user.id });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
 try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // if (!user) {
    //   return res.status(401).json({ message: "User not found" });
    // }
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (user && isMatch) {
      const accessToken = jwt.sign(
        { user: { id: user.id, email: user.email,
            fname: user.fname, lname: user.lname,
          role: user.role,
          profilePic: user.profilePic,
         } },
        
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
    
      const refreshToken = jwt.sign(
        { user: { id: user.id, email: user.email, fname: user.fname, lname: user.lname, role: user.role, profilePic: user.profilePic } },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
  
      await prisma.user.update({
        where: { id: user.id },
        data: {
          refreshToken,
          refreshTokenExp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ accessToken });
    } else {
      res.status(401).json({ message: "Email or password is not valid" });
    }
    
 } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
    
 }
});

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  const user = await prisma.user.findUnique({ where: { refreshToken } });
  if (!user) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Refresh token is not valid" });
      }

      const newAccessToken = jwt.sign(
        { user: { id: decoded.user.id, email: decoded.user.email } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const newRefreshToken = jwt.sign(
        { user: { id: decoded.user.id, email: decoded.user.email } },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      await prisma.user.update({
        where: { id: decoded.user.id },
        data: {
          refreshToken: newRefreshToken,
          refreshTokenExp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ accessToken: newAccessToken });
    }
  );
});

const logOutUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  // Ensure userId is provided
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Delete refresh token
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null, refreshTokenExp: null },
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "Logout successful" });
});


module.exports = { registerUser, loginUser, refreshToken, logOutUser };

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt",token, {
    maxAge: 1000*60*60*24*7,  //MS
    httpOnly:true,  
    sameSite: "strict",  //CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== 'development'
  })
  return token;
};

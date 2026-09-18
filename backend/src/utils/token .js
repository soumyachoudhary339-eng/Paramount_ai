import jwt from "jsonwebtoken";
export const generateToken = (id,time) => {
  return jwt.sign({ id }, process.env.JWT_SECRET , {
    expiresIn: time,
  });
};
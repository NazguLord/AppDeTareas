import { env } from "../config/env.js";
import { loginUser, registerUser } from "../services/auth.service.js";

export const register = async (req, res) => {
  const message = await registerUser(req.body);
  return res.status(200).json(message);
};

export const login = async (req, res) => {
  const { token, user } = await loginUser(req.body);

  return res
    .cookie("access_token", token, {
      httpOnly: true,
      sameSite: env.cookie.sameSite,
      secure: env.cookie.secure,
    })
    .status(200)
    .json(user);
};

export const logout = async (req, res) =>
  res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: env.cookie.sameSite,
      secure: env.cookie.secure,
    })
    .status(200)
    .json("Usuario a sido deslogeado");

import { env } from "../config/env.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { db } from "../config/db.js";
import { findUserByIdQuery } from "../queries/auth.queries.js";

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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(user);
};

export const session = async (req, res) => {
  const [users] = await db.query(findUserByIdQuery, [req.user.id]);
  if (!users.length || users[0].username !== env.allowedUsername) return res.status(401).json({ message: "Sesión no válida." });
  return res.json(users[0]);
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

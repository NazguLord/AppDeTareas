import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { env } from "../config/env.js";
import { findUserByEmailOrUsernameQuery, findUserByUsernameQuery, insertUserQuery } from "../queries/auth.queries.js";
import { AppError } from "../utils/http.js";

export const registerUser = async ({ username, email, password }) => {
  const [existingUsers] = await db.query(findUserByEmailOrUsernameQuery, [email, username]);

  if (existingUsers.length) {
    throw new AppError(409, "Ya existe el usuario");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const values = [username, email, hash];

  await db.query(insertUserQuery, [values]);
  return "Usuario creado.";
};

export const loginUser = async ({ username, password }) => {
  const [users] = await db.query(findUserByUsernameQuery, [username]);

  if (users.length === 0) {
    throw new AppError(404, "Usuario no encontrado!");
  }

  const user = users[0];
  const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError(400, "Usuario o password equivocado!");
  }

  const token = jwt.sign({ id: user.id }, env.jwtSecret);
  const { password: _, ...other } = user;

  return { token, user: other };
};

import { db } from "../config/db.js";
import { deleteContactoQuery, getContactosQuery, insertContactoQuery, updateContactoQuery } from "../queries/contactos.queries.js";

export const getContactos = async () => {
  const [rows] = await db.query(getContactosQuery);
  return rows;
};

export const createContacto = async ({ name, number, email, image }) => {
  const values = [name, number, email, image];
  const [result] = await db.query(insertContactoQuery, [values]);
  return result;
};

export const deleteContacto = async (contactoId) => {
  await db.query(deleteContactoQuery, [contactoId]);
  return "El contacto a sido eliminado correctamente.";
};

export const updateContacto = async (contactoId, { name, number, email, image }) => {
  const values = [name, number, email, image];
  await db.query(updateContactoQuery, [...values, contactoId]);
  return "El contacto se actualizo correctamente.";
};

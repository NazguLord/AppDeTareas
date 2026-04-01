import { createContacto, deleteContacto, getContactos, updateContacto } from "../services/contactos.service.js";

export const listContactos = async (req, res) => res.json(await getContactos());
export const createContactoHandler = async (req, res) => res.json(await createContacto(req.body));
export const deleteContactoHandler = async (req, res) => res.json(await deleteContacto(req.params.id));
export const updateContactoHandler = async (req, res) => res.json(await updateContacto(req.params.id, req.body));

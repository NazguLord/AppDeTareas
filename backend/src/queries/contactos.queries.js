export const getContactosQuery = "SELECT * FROM contactos";
export const insertContactoQuery = "INSERT INTO contactos (`name`, `number`, `email`, `image`) VALUES (?)";
export const deleteContactoQuery = "DELETE FROM contactos WHERE id = ?";
export const updateContactoQuery = "UPDATE contactos SET `name` = ?, `number` = ?, `email` = ?, `image` = ? WHERE id = ?";

export const getRecentTareasQuery = "SELECT * FROM tareas ORDER BY id DESC LIMIT 5";
export const getRegistrosQuery = "SELECT id, tituloTarea, cantidad, DATE_FORMAT(fecha, '%Y-%m-%d %H:%i:%s') AS fecha FROM tareas ORDER BY fecha DESC";
export const getTotalTareasQuery = "SELECT SUM(cantidad) AS Total FROM tareas";
export const insertTareaQuery = "INSERT INTO tareas (`tituloTarea`, `cantidad`, `fecha`) VALUES (?)";
export const deleteTareaQuery = "DELETE FROM tareas WHERE id = ?";
export const updateTareaQuery = "UPDATE tareas SET `tituloTarea` = ?, `cantidad` = ? WHERE id = ?";

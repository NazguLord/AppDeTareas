export const videoFields = ["nombreBanda", "lugar", "fecha", "tipo", "genero_id", "cantidadDiscos", "formato", "version", "almacenamiento", "comentario", "categoria", "peso", "negociable"];
export const listVideosQuery = `SELECT v.*, g.nombre AS genero FROM bootlegs_videos v LEFT JOIN catalogo_generos_bootlegs g ON g.id = v.genero_id ORDER BY LOWER(TRIM(v.nombreBanda)), v.fecha, v.idbootlegs`;
export const insertVideosQuery = `INSERT INTO bootlegs_videos (${videoFields.map((field) => `\`${field}\``).join(", ")}) VALUES ?`;
export const updateVideoQuery = `UPDATE bootlegs_videos SET ${videoFields.map((field) => `\`${field}\` = ?`).join(", ")} WHERE idbootlegs = ?`;

import { AUDIO_BOOTLEGS_TABLE, AUDIO_FORMATS_TABLE, AUDIO_GENRES_TABLE, AUDIO_TYPES_TABLE } from "../constants/tables.js";

export const getAudioFormatosQuery = `SELECT id, codigo, nombre, descripcion FROM ${AUDIO_FORMATS_TABLE} WHERE activo = 1 ORDER BY orden, nombre`;
export const getAudioTiposQuery = `SELECT id, codigo, nombre, descripcion FROM ${AUDIO_TYPES_TABLE} WHERE activo = 1 ORDER BY orden, nombre`;
export const getAudioGenerosQuery = `SELECT id, codigo, nombre, descripcion FROM ${AUDIO_GENRES_TABLE} WHERE activo = 1 ORDER BY orden, nombre`;
export const getAudiosQuery = `SELECT b.idbootlegs, b.nombreBanda, b.lugar, DATE_FORMAT(b.fecha, '%Y-%m-%d') AS fecha, b.tipo, b.genero_id, g.nombre AS genero, b.cantidadDiscos, b.formato, b.version, b.almacenamiento, b.comentario, b.categoria, b.peso, b.negociable FROM ${AUDIO_BOOTLEGS_TABLE} b LEFT JOIN ${AUDIO_GENRES_TABLE} g ON g.id = b.genero_id ORDER BY b.nombreBanda, b.fecha`;
export const updateAudioQuery = `UPDATE ${AUDIO_BOOTLEGS_TABLE} SET \`nombreBanda\` = ?, \`lugar\` = ?, \`fecha\` = ?, \`tipo\` = ?, \`genero_id\` = ?, \`cantidadDiscos\` = ?, \`formato\` = ?, \`version\` = ?, \`almacenamiento\` = ?, \`comentario\` = ?, \`categoria\` = ?, \`peso\` = ?, \`negociable\` = ? WHERE idbootlegs = ?`;

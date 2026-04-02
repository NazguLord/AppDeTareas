import { AUDIO_BOOTLEGS_TABLE } from "../constants/tables.js";

export const insertBootlegQuery = `INSERT INTO ${AUDIO_BOOTLEGS_TABLE} (\`nombreBanda\`, \`lugar\`, \`fecha\`, \`tipo\`, \`genero_id\`, \`cantidadDiscos\`, \`formato\`, \`version\`, \`almacenamiento\`, \`comentario\`, \`categoria\`, \`peso\`, \`negociable\`) VALUES (?)`;
export const showTableLikeQuery = "SHOW TABLES LIKE ?";
export const insertTargetBootlegQuery =
  "INSERT INTO ?? (`nombreBanda`, `lugar`, `fecha`, `tipo`, `cantidadDiscos`, `formato`, `version`, `almacenamiento`, `comentario`, `categoria`, `peso`, `negociable`) VALUES ?";
export const getColumnLengthsQuery = `
  SELECT COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = ?
    AND TABLE_NAME = ?
    AND COLUMN_NAME IN ('nombreBanda', 'lugar', 'tipo', 'formato', 'version', 'almacenamiento', 'comentario', 'categoria', 'peso', 'negociable')
`;

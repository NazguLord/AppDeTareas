export const getAllTransaccionesQuery = `
  SELECT id, tipo, monto, moneda, descripcion, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, created_at
  FROM transacciones
  ORDER BY fecha DESC, id DESC
`;

export const getTransaccionesByTipoQuery = `
  SELECT id, tipo, monto, moneda, descripcion, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, created_at
  FROM transacciones
  WHERE tipo = ?
  ORDER BY fecha DESC, id DESC
`;

export const getTransaccionesByMonedaQuery = `
  SELECT id, tipo, monto, moneda, descripcion, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, created_at
  FROM transacciones
  WHERE moneda = ?
  ORDER BY fecha DESC, id DESC
`;

export const getResumenQuery = `
  SELECT
    tipo,
    moneda,
    SUM(monto) AS total,
    COUNT(*) AS cantidad
  FROM transacciones
  GROUP BY tipo, moneda
`;

export const insertTransaccionQuery = `
  INSERT INTO transacciones (\`tipo\`, \`monto\`, \`moneda\`, \`descripcion\`, \`fecha\`)
  VALUES (?)
`;

export const updateTransaccionQuery = `
  UPDATE transacciones SET \`tipo\` = ?, \`monto\` = ?, \`moneda\` = ?, \`descripcion\` = ?, \`fecha\` = ?
  WHERE id = ?
`;

export const deleteTransaccionQuery = "DELETE FROM transacciones WHERE id = ?";

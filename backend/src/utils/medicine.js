export const normalizeMedicineNumber = (value) => {
  if (value === "" || value === undefined || value === null) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export const buildMedicinePayload = (body = {}, imagen = null, includeFecha = false, fecha = null) => ({
  nombreMedicamento: body.nombreMedicamento || "",
  descripcion: body.descripcion || "",
  cantidad: normalizeMedicineNumber(body.dosisCantidad ?? body.cantidad),
  unidadMedida: body.dosisUnidad || body.unidadMedida || "",
  cantidadPresentacion: normalizeMedicineNumber(body.cantidadPresentacion),
  unidadPresentacion: body.unidadPresentacion || "",
  dosisCantidad: normalizeMedicineNumber(body.dosisCantidad ?? body.cantidad),
  dosisUnidad: body.dosisUnidad || body.unidadMedida || "",
  imagen,
  ...(includeFecha ? { fecha } : {}),
});

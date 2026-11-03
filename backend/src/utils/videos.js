import XLSX from "xlsx";
import moment from "moment";
import { AppError } from "./http.js";

const text = (value) => String(value ?? "").trim();

export const normalizeVideoDate = (value) => {
  const original = text(value);
  if (!original) return { value: "", review: false };
  const iso = moment(original, ["YYYY-MM-DD", "YYYY/MM/DD"], true);
  if (iso.isValid()) return { value: iso.format("YYYY/MM/DD"), review: false };
  const match = original.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (match) {
    const first = Number(match[1]);
    const second = Number(match[2]);
    if (first > 12 || second > 12) {
      const date = moment(original, first > 12 ? "D/M/YYYY" : "M/D/YYYY", true);
      if (date.isValid()) return { value: date.format("YYYY/MM/DD"), review: false };
    }
  }
  return { value: original, review: true };
};

export const parseVideoWorkbook = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheets = workbook.SheetNames.filter((name) => /^(dvds?|br)$/i.test(name.trim()));
  if (!sheets.length) throw new AppError(400, "El archivo debe contener las hojas DVDS o BR.");
  const rows = [];
  for (const sheetName of sheets) {
    const dvd = /^dvds?$/i.test(sheetName.trim());
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: "", raw: false, blankrows: true });
    data.slice(1).forEach((cells, index) => {
      if (!cells.some((cell) => text(cell))) return;
      const date = normalizeVideoDate(cells[2]);
      const count = text(cells[4]);
      const size = text(cells[dvd ? 6 : 5]);
      const weight = size.replace(/\s*(?:gb|g)\s*$/i, "").trim();
      const extra = dvd ? [5, 7, 8, 10] : [9, 10, 11, 12];
      const labelledNotes = extra.map((i) => ({ label: dvd ? XLSX.utils.encode_col(i) : text(data[0][i]), value: text(cells[i]) })).filter((item) => item.value);
      const notes = labelledNotes.map((item) => item.value);
      const explicitFormat = notes.find((note) => /^(mkv|mp4|avi|ts)$/i.test(note));
      const trade = notes.some((note) => /\b(?:not|no)\s+for\s+trade\b/i.test(note)) ? "NOT FOR TRADE" : "";
      const warnings = [];
      if (!text(cells[0])) warnings.push("Falta banda");
      if (date.review) warnings.push("Revisar fecha");
      if (count && !/^\d+$/.test(count)) warnings.push("Revisar cantidad de discos");
      if (weight && !/^\d+(?:[.,]\d+)?$/.test(weight)) warnings.push("Revisar peso");
      if (explicitFormat) warnings.push(`Formato indicado en notas: ${explicitFormat}`);
      if (!dvd && text(cells[6])) warnings.push(`Formato indicado: ${text(cells[6])}`);
      rows.push({ nombreBanda: text(cells[0]), lugar: text(cells[1]), fecha: date.value, tipo: text(cells[3]), genero_id: null, cantidadDiscos: count, formato: dvd ? "DVD" : "Blu-ray", version: dvd ? text(cells[5]) : text(cells[7]), almacenamiento: text(cells[dvd ? 9 : 8]), comentario: [!dvd && text(cells[6]) ? `Formato original: ${text(cells[6])}` : '', ...labelledNotes.map ( (item) => `${item.label}: ${item.value}`)].filter(Boolean).join(" | "), categoria: "Video", peso: weight, negociable: trade, __sheet: sheetName, __rowNumber: index + 2, __warnings: warnings });
    });
  }
  return { rows, sheets, totalRows: rows.length, reviewCount: rows.filter((row) => row.__warnings.length).length };
};

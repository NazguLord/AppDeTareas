import ExcelJS from 'exceljs';

const columns = [
  ['nombreBanda', 'Nombre de banda', 28], ['lugar', 'Lugar', 58], ['fecha', 'Fecha', 20],
  ['tipo', 'Tipo', 18], ['genero', 'Genero', 20], ['cantidadDiscos', 'Cantidad de discos', 20],
  ['formato', 'Formato', 16], ['version', 'Version', 20], ['almacenamiento', 'Almacenamiento', 24],
  ['comentario', 'Comentario', 40], ['categoria', 'Categoria', 14], ['peso', 'Peso', 12], ['negociable', 'Negociable', 18],
];

export async function exportBootlegs(audios, videos) {
  const workbook = new ExcelJS.Workbook();
  [['Audios', audios], ['Vídeos', videos]].forEach(([name, rows]) => {
    const sheet = workbook.addWorksheet(name);
    sheet.columns = columns.map(([key, header, width]) => ({ key, header, width }));
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
    rows.forEach((item) => {
      const row = sheet.addRow(Object.fromEntries(columns.map(([key]) => [key, item[key] ?? ''])));
      if (String(item.negociable || '').trim().toUpperCase() === 'NOT FOR TRADE') {
        const cell = row.getCell('negociable'); cell.font = { color: { argb: 'FF9C0006' }, bold: true }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } };
      }
    });
  });
  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const link = document.createElement('a'); link.href = url; link.download = `bootlegs-${new Date().toISOString().slice(0, 10)}.xlsx`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}

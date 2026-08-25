import React, { useMemo } from 'react';
import { Button, Typography, useTheme } from '@mui/material';
import ExcelJS from 'exceljs';
import PieChart from './PieChart';
import CategoryBarChart from './CategoryBarChart';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const formatCurrency = (amount, currency) => {
  const num = Number(amount || 0);
  const symbol = currency === 'USD' ? '$' : 'L';
  return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const FinanzasReporte = ({ transacciones, resumen }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const ingresosVsEgresos = useMemo(() => {
    const totals = { Ingresos: 0, Egresos: 0 };
    transacciones.forEach((t) => {
      const key = t.tipo === 'ingreso' ? 'Ingresos' : 'Egresos';
      totals[key] += Number(t.monto || 0);
    });
    return [
      { id: 'Ingresos', value: Math.round(totals.Ingresos * 100) / 100 },
      { id: 'Egresos', value: Math.round(totals.Egresos * 100) / 100 },
    ].filter((d) => d.value > 0);
  }, [transacciones]);

  const mensual = useMemo(() => {
    const months = {};
    transacciones.forEach((t) => {
      if (!t.fecha) return;
      const monthIndex = parseInt(t.fecha.substring(5, 7), 10) - 1;
      const label = MONTH_LABELS[monthIndex] || t.fecha.substring(5, 7);
      if (!months[label]) months[label] = { ingresos: 0, egresos: 0 };
      const key = t.tipo === 'ingreso' ? 'ingresos' : 'egresos';
      months[label][key] += Number(t.monto || 0);
    });

    const order = MONTH_LABELS;
    const ingresos = order
      .filter((m) => months[m]?.ingresos > 0)
      .map((m) => ({ id: m, value: Math.round(months[m].ingresos * 100) / 100 }));
    const egresos = order
      .filter((m) => months[m]?.egresos > 0)
      .map((m) => ({ id: m, value: Math.round(months[m].egresos * 100) / 100 }));

    return { ingresos, egresos };
  }, [transacciones]);

  const COLUMNS = [
    { header: 'Tipo', key: 'tipo', width: 12 },
    { header: 'Monto', key: 'monto', width: 15 },
    { header: 'Moneda', key: 'moneda', width: 10 },
    { header: 'Descripcion', key: 'descripcion', width: 40 },
    { header: 'Fecha', key: 'fecha', width: 14 },
  ];

  const BORDER = {
    top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
  };

  const styleHeader = (sheet) => {
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
  };

  const styleAllRows = (sheet) => {
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = BORDER;
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    });
  };

  const addRow = (sheet, t, forceColor) => {
    const row = sheet.addRow({
      tipo: t.tipo === 'ingreso' ? 'Ingreso' : 'Egreso',
      monto: Number(t.monto),
      moneda: t.moneda,
      descripcion: t.descripcion,
      fecha: t.fecha,
    });
    if (forceColor) {
      row.eachCell((cell) => {
        cell.font = { color: { argb: forceColor } };
      });
    }
    return row;
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const egresos = transacciones.filter((t) => t.tipo === 'egreso');
    const ingresos = transacciones.filter((t) => t.tipo === 'ingreso');

    // Pestaña 1: Todos
    const sheetTodos = workbook.addWorksheet('Todos');
    sheetTodos.columns = COLUMNS;
    styleHeader(sheetTodos);
    transacciones.forEach((t) => {
      addRow(sheetTodos, t, t.tipo === 'egreso' ? 'FFDC2626' : null);
    });
    styleAllRows(sheetTodos);

    // Pestaña 2: Egresos
    const sheetEgresos = workbook.addWorksheet('Egresos');
    sheetEgresos.columns = COLUMNS;
    styleHeader(sheetEgresos);
    egresos.forEach((t) => addRow(sheetEgresos, t, 'FFDC2626'));
    styleAllRows(sheetEgresos);

    // Pestaña 3: Ingresos
    const sheetIngresos = workbook.addWorksheet('Ingresos');
    sheetIngresos.columns = COLUMNS;
    styleHeader(sheetIngresos);
    ingresos.forEach((t) => addRow(sheetIngresos, t, 'FF16A34A'));
    styleAllRows(sheetIngresos);

    // Pestaña 4: Por Mes
    const sheetMes = workbook.addWorksheet('Por Mes');
    sheetMes.columns = COLUMNS;
    styleHeader(sheetMes);

    const byMonth = {};
    transacciones.forEach((t) => {
      if (!t.fecha) return;
      const monthNum = parseInt(t.fecha.substring(5, 7), 10);
      const monthName = MONTH_NAMES[monthNum - 1] || t.fecha.substring(5, 7);
      if (!byMonth[monthNum]) byMonth[monthNum] = { name: monthName, items: [] };
      byMonth[monthNum].items.push(t);
    });

    const sortedMonths = Object.keys(byMonth).sort((a, b) => Number(a) - Number(b));
    sortedMonths.forEach((monthNum) => {
      const group = byMonth[monthNum];
      // Fila de separador de mes
      const sepRow = sheetMes.addRow({ tipo: `--- ${group.name} ---`, monto: '', moneda: '', descripcion: '', fecha: '' });
      sepRow.font = { bold: true, color: { argb: 'FF1D4ED8' } };
      sepRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };

      group.items.forEach((t) => addRow(sheetMes, t, t.tipo === 'egreso' ? 'FFDC2626' : 'FF16A34A'));

      // Subtotal del mes
      const totalMes = group.items.reduce((sum, t) => {
        const val = Number(t.monto || 0);
        return sum + (t.tipo === 'ingreso' ? val : -val);
      }, 0);
      const subRow = sheetMes.addRow({
        tipo: 'Subtotal',
        monto: Math.round(totalMes * 100) / 100,
        moneda: '',
        descripcion: `${group.items.length} movimientos`,
        fecha: '',
      });
      subRow.font = { bold: true };
      subRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    });
    styleAllRows(sheetMes);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `finanzas-${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  const sectionTitle = {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--title)',
    marginBottom: '0.75rem',
  };

  const chartCard = {
    padding: '1.5rem',
    borderRadius: '18px',
    border: '1px solid var(--line)',
    background: isDark ? 'rgba(15, 23, 42, 0.38)' : 'rgba(255, 255, 255, 0.52)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-kicker">Reporte</span>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--title)' }}>
            Resumen financiero
          </Typography>
        </div>
        <Button variant="outlined" className="secondary-cta" onClick={handleExportExcel} startIcon={<DownloadOutlinedIcon />}>
          Exportar Excel
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        <div style={chartCard}>
          <Typography sx={sectionTitle}>Ingresos vs Egresos</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            Distribucion total por tipo de movimiento
          </Typography>
          <PieChart data={ingresosVsEgresos} />
        </div>

        <div style={chartCard}>
          <Typography sx={sectionTitle}>Totales mensuales - Ingresos</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            Ingresos acumulados por mes
          </Typography>
          <CategoryBarChart data={mensual.ingresos} preserveOrder minHeight={320} />
        </div>

        <div style={chartCard}>
          <Typography sx={sectionTitle}>Totales mensuales - Egresos</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            Egresos acumulados por mes
          </Typography>
          <CategoryBarChart data={mensual.egresos} preserveOrder minHeight={320} />
        </div>
      </div>
    </div>
  );
};

export default FinanzasReporte;

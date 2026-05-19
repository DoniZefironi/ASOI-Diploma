import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface AnalyticsStats {
  summary: {
    totalAll: number;
    totalToday: number;
    total7d: number;
    total30d: number;
    uniqueUsers30d: number;
  };
  topPages: { path: string; visits: number }[];
  dailyVisits: { day: string; visits: number; uniqueUsers: number }[];
  recentVisits: {
    path: string;
    userId: number | null;
    userDisplayName: string | null;
    visitedAt: string;
  }[];
}

export async function exportAnalyticsToExcel(
  data: AnalyticsStats,
  fileName?: string,
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ASOI Diploma System';
  workbook.created = new Date();

  const headerStyle: Partial<ExcelJS.Style> = {
    font: { bold: true, size: 14, color: { argb: 'FFFFFFFF' } },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' },
    } as ExcelJS.FillPattern,
    alignment: { horizontal: 'center', vertical: 'middle' },
  };

  const titleStyle: Partial<ExcelJS.Style> = {
    font: { bold: true, size: 18, color: { argb: 'FF1E40AF' } },
    alignment: { horizontal: 'center' },
  };

  const currentDate = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // === Лист 1: Сводка ===
  const summarySheet = workbook.addWorksheet('Сводка');

  summarySheet.mergeCells('A1:B1');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = 'Посещаемость сайта';
  titleCell.style = titleStyle;

  summarySheet.getCell('A3').value = 'Дата генерации:';
  summarySheet.getCell('B3').value = currentDate;
  summarySheet.getCell('B3').style = { font: { italic: true } };

  summarySheet.getCell('A5').value = 'Всего визитов (за всё время):';
  summarySheet.getCell('B5').value = data.summary.totalAll;
  summarySheet.getCell('B5').style = { font: { bold: true, size: 12 } };

  summarySheet.getCell('A6').value = 'Визитов сегодня:';
  summarySheet.getCell('B6').value = data.summary.totalToday;

  summarySheet.getCell('A7').value = 'Визитов за 7 дней:';
  summarySheet.getCell('B7').value = data.summary.total7d;

  summarySheet.getCell('A8').value = 'Визитов за 30 дней:';
  summarySheet.getCell('B8').value = data.summary.total30d;

  summarySheet.getCell('A9').value = 'Уникальных пользователей (30 дн.):';
  summarySheet.getCell('B9').value = data.summary.uniqueUsers30d;
  summarySheet.getCell('B9').style = { font: { bold: true, color: { argb: 'FF16A34A' } } };

  summarySheet.getColumn('A').width = 36;
  summarySheet.getColumn('B').width = 20;

  // === Лист 2: По дням ===
  const dailySheet = workbook.addWorksheet('По дням');

  dailySheet.mergeCells('A1:D1');
  const dailyTitle = dailySheet.getCell('A1');
  dailyTitle.value = 'Визиты по дням (последние 30 дней)';
  dailyTitle.style = titleStyle;

  const dailyHeaders = ['Дата', 'Визиты', 'Уникальных пользователей', 'График'];
  const dailyHeaderRow = dailySheet.addRow(dailyHeaders);
  dailyHeaderRow.eachCell(cell => {
    cell.style = headerStyle;
  });

  const maxVisits = Math.max(...data.dailyVisits.map(d => d.visits), 1);

  data.dailyVisits.forEach((d, index) => {
    const barLength = Math.round((d.visits / maxVisits) * 25);
    const bar = '█'.repeat(barLength);
    const row = dailySheet.addRow([
      new Date(d.day).toLocaleDateString('ru-RU'),
      d.visits,
      d.uniqueUsers,
      bar,
    ]);
    row.getCell(4).style = { font: { color: { argb: 'FF3B82F6' }, size: 10 } };
    if (index % 2 === 0) {
      row.eachCell((cell, colNumber) => {
        if (colNumber < 4) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF3F4F6' },
          } as ExcelJS.FillPattern;
        }
      });
    }
  });

  dailySheet.getColumn('A').width = 16;
  dailySheet.getColumn('B').width = 12;
  dailySheet.getColumn('C').width = 24;
  dailySheet.getColumn('D').width = 32;

  // === Лист 3: Популярные страницы ===
  const pagesSheet = workbook.addWorksheet('Популярные страницы');

  pagesSheet.mergeCells('A1:D1');
  const pagesTitle = pagesSheet.getCell('A1');
  pagesTitle.value = 'Популярные страницы (топ-15)';
  pagesTitle.style = titleStyle;

  const pagesHeaders = ['#', 'Страница', 'Визиты', 'Гистограмма'];
  const pagesHeaderRow = pagesSheet.addRow(pagesHeaders);
  pagesHeaderRow.eachCell(cell => {
    cell.style = headerStyle;
  });

  const maxPageVisits = Math.max(...data.topPages.map(p => p.visits), 1);

  data.topPages.forEach((p, index) => {
    const barLength = Math.round((p.visits / maxPageVisits) * 25);
    const bar = '█'.repeat(barLength);
    const row = pagesSheet.addRow([index + 1, p.path, p.visits, bar]);
    row.getCell(4).style = { font: { color: { argb: 'FF3B82F6' }, size: 10 } };
    if (index % 2 === 0) {
      row.eachCell((cell, colNumber) => {
        if (colNumber < 4) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF3F4F6' },
          } as ExcelJS.FillPattern;
        }
      });
    }
  });

  pagesSheet.getColumn('A').width = 6;
  pagesSheet.getColumn('B').width = 40;
  pagesSheet.getColumn('C').width = 12;
  pagesSheet.getColumn('D').width = 32;

  // === Лист 4: Последние визиты ===
  const recentSheet = workbook.addWorksheet('Последние визиты');

  const recentHeaders = ['Страница', 'Пользователь', 'Дата и время'];
  const recentHeaderRow = recentSheet.addRow(recentHeaders);
  recentHeaderRow.eachCell(cell => {
    cell.style = headerStyle;
  });

  data.recentVisits.forEach((v, index) => {
    const row = recentSheet.addRow([
      v.path,
      v.userDisplayName ?? '—',
      new Date(v.visitedAt).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    ]);
    if (index % 2 === 0) {
      row.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8FAFC' },
        } as ExcelJS.FillPattern;
      });
    }
  });

  recentSheet.getColumn('A').width = 35;
  recentSheet.getColumn('B').width = 28;
  recentSheet.getColumn('C').width = 20;

  // Сохранение
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, fileName || `analytics-${Date.now()}.xlsx`);
}

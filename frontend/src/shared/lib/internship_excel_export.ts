// src/shared/lib/internship_excel_export.ts
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { InternshipStat, InternshipApplicationRecord } from '@/shared/api/internships';

export async function exportInternshipStatsToExcel(
  stats: InternshipStat[],
  applications: InternshipApplicationRecord[],
  fileName?: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ASOI Diploma System';
  workbook.created = new Date();

  // === Лист 1: Общая статистика ===
  const summarySheet = workbook.addWorksheet('Общая статистика');
  
  const headerStyle = {
    font: { bold: true, size: 14, color: { argb: 'FFFFFFFF' } },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' },
    },
    alignment: { horizontal: 'center', vertical: 'middle' },
  };

  const titleStyle = {
    font: { bold: true, size: 18, color: { argb: 'FF1E40AF' } },
    alignment: { horizontal: 'center' },
  };

  // Заголовок
  summarySheet.mergeCells('A1:E1');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = 'Статистика по стажировкам';
  titleCell.style = titleStyle;

  // Дата генерации
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  summarySheet.getCell('A3').value = 'Дата генерации:';
  summarySheet.getCell('B3').value = currentDate;
  summarySheet.getCell('B3').style = { font: { italic: true } };

  // Сводная статистика
  const totalViews = stats.reduce((sum, s) => sum + s.views, 0);
  const totalApplications = stats.reduce((sum, s) => sum + s.applications, 0);
  const avgConversion = stats.length > 0
    ? Math.round(stats.reduce((sum, s) => sum + s.conversionRate, 0) / stats.length)
    : 0;

  summarySheet.getCell('A5').value = 'Всего стажировок:';
  summarySheet.getCell('B5').value = stats.length;

  summarySheet.getCell('A6').value = 'Всего просмотров:';
  summarySheet.getCell('B6').value = totalViews;

  summarySheet.getCell('A7').value = 'Всего заявок:';
  summarySheet.getCell('B7').value = totalApplications;

  summarySheet.getCell('A8').value = 'Средняя конверсия:';
  summarySheet.getCell('B8').value = `${avgConversion}%`;
  summarySheet.getCell('B8').style = { font: { bold: true, color: { argb: 'FF16A34A' } } };

  summarySheet.getColumn('A').width = 30;
  summarySheet.getColumn('B').width = 20;

  // === Лист 2: Детальная статистика ===
  const detailSheet = workbook.addWorksheet('Детальная статистика');

  const headers = ['Стажировка', 'Компания', 'Просмотры', 'Заявки', 'Конверсия (%)', 'Последний просмотр', 'Последняя заявка'];
  const headerRow = detailSheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.style = headerStyle;
  });

  const sortedStats = [...stats].sort((a, b) => b.applications - a.applications);

  sortedStats.forEach((stat, index) => {
    const row = detailSheet.addRow([
      stat.internshipTitle,
      stat.company,
      stat.views,
      stat.applications,
      stat.conversionRate,
      stat.lastViewedAt ? new Date(stat.lastViewedAt).toLocaleDateString('ru-RU') : '—',
      stat.lastAppliedAt ? new Date(stat.lastAppliedAt).toLocaleDateString('ru-RU') : '—',
    ]);
    
    // Чередование цветов
    if (index % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF3F4F6' },
        };
      });
    }

    // Подсветка высокой конверсии
    if (stat.conversionRate >= 20) {
      row.getCell(5).style = { font: { bold: true, color: { argb: 'FF16A34A' } } };
    }
  });

  // Настройка ширины колонок
  detailSheet.getColumn('A').width = 35;
  detailSheet.getColumn('B').width = 25;
  detailSheet.getColumn('C').width = 12;
  detailSheet.getColumn('D').width = 12;
  detailSheet.getColumn('E').width = 14;
  detailSheet.getColumn('F').width = 18;
  detailSheet.getColumn('G').width = 18;

  // === Лист 3: Заявки ===
  const applicationsSheet = workbook.addWorksheet('Заявки');

  const appHeaders = ['Пользователь', 'Email', 'Стажировка', 'Компания', 'Дата подачи', 'Комментарий'];
  const appHeaderRow = applicationsSheet.addRow(appHeaders);
  appHeaderRow.eachCell((cell) => {
    cell.style = headerStyle;
  });

  const sortedApplications = [...applications].sort(
    (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  );

  sortedApplications.forEach((app, index) => {
    const row = applicationsSheet.addRow([
      `${app.userFirstName} ${app.userLastName}`,
      app.userEmail,
      app.internshipTitle,
      app.company,
      new Date(app.appliedAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      app.comment || '',
    ]);
    
    // Чередование цветов
    if (index % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8FAFC' },
        };
      });
    }
  });

  applicationsSheet.getColumn('A').width = 30;
  applicationsSheet.getColumn('B').width = 30;
  applicationsSheet.getColumn('C').width = 35;
  applicationsSheet.getColumn('D').width = 25;
  applicationsSheet.getColumn('E').width = 20;
  applicationsSheet.getColumn('F').width = 30;

  // Сохранение файла
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const defaultFileName = `internship-stats-${Date.now()}.xlsx`;
  saveAs(blob, fileName || defaultFileName);
}

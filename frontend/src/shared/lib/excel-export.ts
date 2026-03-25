// src/shared/lib/excel-export.ts
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ProfessionStat } from '@/shared/api/admin';

export async function exportProfOrientationStatsToExcel(
  stats: ProfessionStat[],
  fileName?: string
): Promise<void> {
  if (!stats || stats.length === 0) {
    throw new Error('Нет данных для экспорта');
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ASOI Diploma System';
  workbook.created = new Date();

  // === Лист 1: Общая статистика ===
  const summarySheet = workbook.addWorksheet('Общая статистика');
  
  // Настройка стилей
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
  summarySheet.mergeCells('A1:C1');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = 'Анализ профориентации';
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

  // Общая статистика
  const totalUsers = stats.reduce((sum, stat) => sum + stat.count, 0);
  const topProfession = stats.reduce((max, stat) => stat.count > max.count ? stat : max, stats[0]);

  summarySheet.getCell('A5').value = 'Всего тестов пройдено:';
  summarySheet.getCell('B5').value = totalUsers;
  summarySheet.getCell('B5').style = { font: { bold: true, size: 12 } };

  summarySheet.getCell('A6').value = 'Уникальных профессий:';
  summarySheet.getCell('B6').value = stats.length;

  summarySheet.getCell('A7').value = 'Самая популярная профессия:';
  summarySheet.getCell('B7').value = `${topProfession.profession} (${topProfession.count} чел.)`;
  summarySheet.getCell('B7').style = { font: { bold: true, color: { argb: 'FF16A34A' } } };

  // Настройка ширины колонок
  summarySheet.getColumn('A').width = 30;
  summarySheet.getColumn('B').width = 40;
  summarySheet.getColumn('C').width = 15;

  // === Лист 2: Детальная статистика ===
  const detailSheet = workbook.addWorksheet('Детальная статистика');

  // Заголовки таблицы
  const headers = ['Профессия', 'Количество', 'Доля (%)'];
  const headerRow = detailSheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.style = headerStyle;
  });

  // Данные с сортировкой
  const sortedStats = [...stats]
    .sort((a, b) => b.count - a.count)
    .map(stat => ({
      profession: stat.profession,
      count: stat.count,
      percentage: ((stat.count / totalUsers) * 100).toFixed(1),
    }));

  sortedStats.forEach((stat, index) => {
    const row = detailSheet.addRow([
      stat.profession,
      stat.count,
      parseFloat(stat.percentage),
    ]);
    
    // Чередование цветов строк
    if (index % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF3F4F6' },
        };
      });
    }
  });

  // Настройка ширины колонок
  detailSheet.getColumn('A').width = 40;
  detailSheet.getColumn('B').width = 15;
  detailSheet.getColumn('C').width = 15;

  // Применяем форматирование к колонке с процентами
  detailSheet.getColumn('C').numFmt = '0.0';

  // === Лист 3: Визуализация (гистограмма) ===
  const chartSheet = workbook.addWorksheet('Визуализация');

  // Заголовок
  chartSheet.mergeCells('A1:D1');
  const chartTitle = chartSheet.getCell('A1');
  chartTitle.value = 'Распределение по профессиям';
  chartTitle.style = titleStyle;

  // Подзаголовок с пояснением
  chartSheet.getCell('A3').value = 'Наглядное представление в виде гистограммы:';
  chartSheet.getCell('A3').style = { font: { italic: true, size: 12 } };

  // Заголовки таблицы
  const chartHeaders = ['Профессия', 'Кол-во', 'Доля', 'Гистограмма'];
  const chartHeaderRow = chartSheet.addRow(chartHeaders);
  chartHeaderRow.eachCell((cell) => {
    cell.style = headerStyle;
  });

  const maxCount = Math.max(...stats.map(s => s.count));
  
  sortedStats.forEach((stat, index) => {
    const row = chartSheet.addRow([
      stat.profession,
      stat.count,
      parseFloat(stat.percentage),
    ]);
    
    // Создаём "гистограмму" с помощью повторения символов
    const barLength = Math.round((stat.count / maxCount) * 25);
    const bar = '█'.repeat(barLength);
    row.getCell(4).value = bar;
    row.getCell(4).style = {
      font: { color: { argb: 'FF3B82F6' }, size: 10 },
    };

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

  chartSheet.getColumn('A').width = 35;
  chartSheet.getColumn('B').width = 12;
  chartSheet.getColumn('C').width = 12;
  chartSheet.getColumn('D').width = 35;
  chartSheet.getColumn('C').numFmt = '0.0';

  // Сохранение файла
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const defaultFileName = `prof-orientation-analysis-${Date.now()}.xlsx`;
  saveAs(blob, fileName || defaultFileName);
}

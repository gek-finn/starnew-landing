// ============================================================
// GOOGLE APPS SCRIPT — ЗАПИСЬ ЗАЯВОК В ТАБЛИЦУ
// ============================================================
// 
// ИНСТРУКЦИЯ ПО ПОДКЛЮЧЕНИЮ:
// 
// 1. Откройте Google Таблицы: https://sheets.google.com
// 2. Создайте новую таблицу (или откройте существующую)
// 3. В меню выберите: Расширения → Apps Script
// 4. Удалите весь код по умолчанию и вставьте этот код
// 5. Нажмите "Сохранить" (Ctrl+S)
// 6. Нажмите "Развернуть" → "Создать развёртывание"
// 7. Тип: "Веб-приложение"
//    - Доступ: "Все" (или "Все, у кого есть ссылка")
// 8. Нажмите "Развернуть" и подтвердите доступ
// 9. Скопируйте URL веб-приложения
// 10. Вставьте этот URL в файл js/main.js в константу GOOGLE_SCRIPT_URL
//
// ============================================================

const SHEET_NAME = 'Заявки';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.phone || '',
      data.package || '',
      data.source || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Добавляем заголовки CORS для корректной работы с сайтом
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Добавляем заголовки CORS для корректной работы с сайтом
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Дата', 'Имя', 'Телефон', 'Комплект', 'Источник']);
  }
  return sheet;
}

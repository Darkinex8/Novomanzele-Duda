/**
 * Google Apps Script pro svatební RSVP.
 *
 * 1) Vytvořte Google Tabulku.
 * 2) Rozšíření -> Apps Script.
 * 3) Vložte tento kód a uložte.
 * 4) Nasadit -> Nové nasazení -> Webová aplikace.
 *    Spouštět jako: Já
 *    Kdo má přístup: Všichni
 * 5) Zkopírujte URL webové aplikace do proměnné RSVP_SHEETS_URL v script.js.
 */

const SHEET_NAME = 'Odpovědi';

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Čas odeslání',
        'Jméno a příjmení',
        'Účast',
        'Alergie / speciální strava',
        'Ubytování',
        'Odvoz',
        'Pití',
        'Poznámka'
      ]);
      sheet.setFrozenRows(1);
    } else {
      // Pokud už tabulka existuje ze starší verze, přesuneme původní
      // sloupec Poznámka z G do H a vložíme nový sloupec Pití do G.
      const g1 = sheet.getRange(1, 7).getValue();
      const h1 = sheet.getRange(1, 8).getValue();
      if (g1 === 'Poznámka' && h1 !== 'Poznámka') {
        const lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          sheet.getRange(2, 7, lastRow - 1, 1).copyTo(sheet.getRange(2, 8, lastRow - 1, 1));
        }
        sheet.getRange(1, 8).setValue('Poznámka');
        sheet.getRange(1, 7).setValue('Pití');
      } else {
        if (sheet.getRange(1, 7).getValue() !== 'Pití') sheet.getRange(1, 7).setValue('Pití');
        if (sheet.getRange(1, 8).getValue() !== 'Poznámka') sheet.getRange(1, 8).setValue('Poznámka');
      }
    }

    const payload = JSON.parse(e.parameter.rsvp_payload || '{}');
    const guests = Array.isArray(payload.guests) ? payload.guests : [];
    const note = payload.note || '';
    const timestamp = new Date();

    guests.forEach(function(guest) {
      sheet.appendRow([
        timestamp,
        guest.name || '',
        guest.attending || '',
        guest.diet || '',
        guest.accommodation || '',
        guest.transport || '',
        guest.drink || '',
        note
      ]);
    });

    return HtmlService.createHtmlOutput(
      '<!doctype html><html><body>OK</body></html>'
    );
  } catch (err) {
    return HtmlService.createHtmlOutput(
      '<!doctype html><html><body>CHYBA</body></html>'
    );
  }
}

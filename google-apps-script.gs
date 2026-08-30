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
        'Poznámka'
      ]);
      sheet.setFrozenRows(1);
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

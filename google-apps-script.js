// ============================================================
// Google Apps Script for Tech Portal → Google Sheets
// ============================================================
//
// HOW TO SET THIS UP:
//
// 1. Open your "Dustin's Parts" Google Sheet
// 2. Click Extensions → Apps Script
// 3. Delete any code in the editor
// 4. Paste this entire file
// 5. Click the disk icon (Save), name it "Tech Portal"
// 6. Click Deploy → Manage deployments → Edit (pencil icon)
//    OR if first time: Deploy → New deployment → Web app
// 7. Set "Execute as": Me
// 8. Set "Who has access": Anyone
// 9. Set Version to "New version"
// 10. Click Deploy
// 11. Copy the Web App URL it gives you
// 12. In Tech Portal (Parts tab), click "Send to Google Sheet"
//     and paste the URL when prompted
//
// That's it! The URL is saved in your browser so you only enter it once.
//
// IMPORTANT: If you update this script, you must create a NEW deployment
// version (step 9) for changes to take effect.
// ============================================================

// This handles GET requests from Tech Portal
// (GET avoids all CORS issues — data comes as URL parameters)
function doGet(e) {
  try {
    // If no parameters, just show a status message
    if (!e.parameter.customer) {
      return ContentService.createTextOutput(
        'Tech Portal sheet integration is running. Send data from the app.'
      );
    }

    // Get data from URL parameters
    var customer = e.parameter.customer || '';
    var invoice = e.parameter.invoice || '';
    var partInfo = e.parameter.partInfo || '';
    var status = e.parameter.status || 'Aa';
    var highlight = e.parameter.highlight === 'true';

    // Open the "Parts to be ordered" sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet()
                  .getSheetByName('Parts to be ordered');

    // Find the first empty row (after the header row)
    var lastRow = sheet.getLastRow();
    var newRow = lastRow + 1;

    // Write data to columns A-D
    // A: Customer Name
    // B: Invoice #
    // C: Part info (formatted as ***P# number*** **description**)
    // D: Status (Aa or date)
    sheet.getRange(newRow, 1).setValue(customer);    // Column A
    sheet.getRange(newRow, 2).setValue(invoice);      // Column B
    sheet.getRange(newRow, 3).setValue(partInfo);     // Column C
    sheet.getRange(newRow, 4).setValue(status);       // Column D

    // If warranty flag is set, highlight the entire row yellow
    if (highlight) {
      sheet.getRange(newRow, 1, 1, 26).setBackground('#ffff00'); // A-Z yellow
    }

    // Return success
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok', row: newRow })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

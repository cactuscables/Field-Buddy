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
// 6. Click Deploy → New deployment
// 7. Select type: "Web app"
// 8. Set "Execute as": Me
// 9. Set "Who has access": Anyone
//    (This is safe — the URL is unguessable and only your app knows it)
// 10. Click Deploy
// 11. Copy the Web App URL it gives you
// 12. In Tech Portal (Parts tab), click "Send to Google Sheet"
//     and paste the URL when prompted
//
// That's it! The URL is saved in your browser so you only enter it once.
// ============================================================

// This function runs when Tech Portal sends data via POST
function doPost(e) {
  try {
    // Parse the incoming data from Tech Portal
    var data = JSON.parse(e.postData.contents);

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
    sheet.getRange(newRow, 1).setValue(data.customer);   // Column A
    sheet.getRange(newRow, 2).setValue(data.invoice);     // Column B
    sheet.getRange(newRow, 3).setValue(data.partInfo);    // Column C
    sheet.getRange(newRow, 4).setValue(data.status);      // Column D

    // If warranty flag is set, highlight the entire row yellow
    if (data.highlight) {
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

// This handles GET requests (just for testing — visit the URL in a browser)
function doGet(e) {
  return ContentService.createTextOutput(
    'Tech Portal sheet integration is running. Use POST to send data.'
  );
}

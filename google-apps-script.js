function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Entries");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Entries");
      sheet.appendRow([
        "Submitted At",
        "Full Name",
        "Contact Number",
        "Instagram Handle",
        "Shared Story",
        "Receipt URL",
        "Story Screenshot URL",
      ]);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.submittedAt || "",
      data.fullName || "",
      data.contactNumber || "",
      data.instagramHandle || "",
      data.sharedStory || "",
      data.receiptUrl || "",
      data.storyScreenshotUrl || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

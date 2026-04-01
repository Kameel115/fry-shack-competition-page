/**
 * Set this to your competition root folder ID in Google Drive.
 * All entrant folders/files will be created under this parent.
 */
var COMPETITION_ROOT_FOLDER_ID = "1J_VwbR7KG7pUTA-ITkrRDahn58pZ8hkN";

function sanitizeName(name) {
  if (!name) return "Unknown Entrant";
  return String(name).trim().replace(/[\\/:*?"<>|]/g, "-").slice(0, 80);
}

function getOrCreateEntrantFolder(root, entrantName) {
  var safeName = sanitizeName(entrantName);
  var matches = root.getFoldersByName(safeName);
  if (matches.hasNext()) return matches.next();
  return root.createFolder(safeName);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || "{}");

    if (data.action !== "uploadFile") {
      throw new Error("Unsupported action");
    }

    if (!COMPETITION_ROOT_FOLDER_ID || COMPETITION_ROOT_FOLDER_ID === "PASTE_YOUR_COMPETITION_FOLDER_ID_HERE") {
      throw new Error("Set COMPETITION_ROOT_FOLDER_ID in script first");
    }

    var rootFolder = DriveApp.getFolderById(COMPETITION_ROOT_FOLDER_ID);
    var entrantFolder = getOrCreateEntrantFolder(rootFolder, data.entrantName || "Unknown Entrant");

    var bytes = Utilities.base64Decode(data.fileBase64 || "");
    var mimeType = data.mimeType || "application/octet-stream";
    var originalName = data.fileName || "upload";
    var safeFileName = sanitizeName(originalName);
    var prefix = data.fileType === "receipt" ? "Receipt" : "Story";
    var fileName = prefix + " - " + new Date().toISOString().replace(/[:.]/g, "-") + " - " + safeFileName;

    var blob = Utilities.newBlob(bytes, mimeType, fileName);
    var file = entrantFolder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: true,
          fileId: file.getId(),
          fileUrl: file.getUrl(),
          entrantFolderId: entrantFolder.getId(),
          entrantFolderUrl: entrantFolder.getUrl(),
        })
      )
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

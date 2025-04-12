const fs = require("fs");
const csv = require("csv-parser");
const xlsx = require("xlsx");

function validateContact(contact) {
  const emailValid =
    contact.email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contact.email);
  const phoneValid =
    contact.phone && /^[0-9+\-()\s]{7,20}$/.test(contact.phone);

  return contact.name && emailValid && contact.message && phoneValid;
}

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const contacts = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (validateContact(row)) {
          contacts.push(row);
        } else {
          console.warn(` Invalid row skipped:`, row);
        }
      })
      .on("end", () => resolve(contacts))
      .on("error", reject);
  });
}

function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = xlsx.utils.sheet_to_json(sheet);

  const validContacts = json.filter((row) => {
    if (validateContact(row)) return true;
    console.warn(` Invalid row skipped:`, row);
    return false;
  });

  return validContacts;
}

module.exports = { parseCSV, parseExcel };

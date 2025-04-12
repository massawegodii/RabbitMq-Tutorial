const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { sendToQueue } = require("./queue/producer");
const { parseCSV, parseExcel } = require("./utils/parser");

const app = express();
app.use(cors({ origin: ['http://localhost:4200'] }));

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    let contacts = [];

    if (file.mimetype === "text/csv") {
      contacts = await parseCSV(file.path);
    } else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      contacts = parseExcel(file.path);
    } else {
      return res.status(400).send("Unsupported file type");
    }

    for (const contact of contacts) {
      await sendToQueue(contact);
    }

    res.send(`Uploaded ${contacts.length} contacts successfully.`);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Upload failed.");
  }
});

app.listen(3000, () =>
  console.log("🚀 Backend running at http://localhost:3000")
);

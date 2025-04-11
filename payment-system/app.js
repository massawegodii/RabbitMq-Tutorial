const express = require("express");
const bodyParser = require("body-parser");
const { sendToQueue } = require("./queue/producer");

const app = express();
app.use(bodyParser.json());

app.post("/pay", async (req, res) => {
  const { orderId, amount } = req.body;
  if (!orderId || !amount) return res.status(400).send("Missing data");

  await sendToQueue({ orderId, amount });
  res.send(`Payment request queued for Order ${orderId}`);
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

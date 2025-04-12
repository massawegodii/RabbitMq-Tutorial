const amqp = require("amqplib");
const dotenv = require("dotenv");
dotenv.config();

async function sendToQueue(data) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();
  const queue = process.env.QUEUE_NAME;

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
    persistent: true,
  });

  console.log("📤 Contact sent to queue:", data.email);
  setTimeout(() => conn.close(), 500);
}

module.exports = { sendToQueue };

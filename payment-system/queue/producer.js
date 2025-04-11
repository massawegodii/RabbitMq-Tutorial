const amqp = require('amqplib');

async function sendToQueue(data) {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  const queue = 'payments';

  await ch.assertQueue(queue);
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)));

  console.log('📤 Sent to queue:', data);
  setTimeout(() => conn.close(), 500);
}

module.exports = { sendToQueue };

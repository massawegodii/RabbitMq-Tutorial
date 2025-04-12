const amqp = require("amqplib");
const dotenv = require("dotenv");
dotenv.config();

async function processQueue() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();
  const queue = process.env.QUEUE_NAME;

  await channel.assertQueue(queue);
  console.log("👂 Listening for contacts...");

  channel.consume(queue, async (msg) => {
    const contact = JSON.parse(msg.content.toString());

    // Simulate processing
    console.log(` Contact: ${contact.name}`);
    console.log(` Email: ${contact.email}`);
    console.log(` Message: ${contact.message}`);

    // Simulated SMS send
    if (contact.phone) {
      console.log(
        ` Simulated SMS to ${contact.phone}: "Hi ${contact.name}, we received your message!"`
      );
    }

    channel.ack(msg);
  });
}

processQueue();

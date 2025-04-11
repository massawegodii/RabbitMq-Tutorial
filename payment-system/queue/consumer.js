const amqp = require("amqplib");

const MAX_RETRIES = 3;

async function startConsumer() {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();
  const queue = "payments";

  await ch.assertQueue(queue);
  console.log("👂 Waiting for payment jobs...");

  ch.consume(queue, async (msg) => {
    const data = JSON.parse(msg.content.toString());
    const retries = data.retries || 0;

    try {
      console.log(
        `💳 Processing payment for Order ${data.orderId} - Amount: ${data.amount} (Retry: ${retries})`
      );

      //  Simulate a failure condition randomly
      if (Math.random() < 0.5) throw new Error("Simulated payment failure");

      //  Simulated success
      await new Promise((r) => setTimeout(r, 2000));
      console.log(` Payment succeeded for Order ${data.orderId}`);

      ch.ack(msg); // Acknowledge success
    } catch (err) {
      console.log(` Payment failed for Order ${data.orderId}: ${err.message}`);

      if (retries < MAX_RETRIES) {
        // Re-publish with incremented retry count
        data.retries = retries + 1;
        ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
          persistent: true,
        });
        console.log(
          ` Retrying (${data.retries}/${MAX_RETRIES}) for Order ${data.orderId}`
        );
      } else {
        console.log(` Max retries reached. Giving up on Order ${data.orderId}`);
      }

      ch.ack(msg); // Acknowledge anyway to remove from queue
    }
  });
}

startConsumer();

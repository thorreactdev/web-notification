const { connect, consumeQueue } = require("./rabbitmq");
const { getTokens } = require("./tokens");
const admin = require("./firebase");

async function startConsumer() {
  await connect();
  consumeQueue(async (message) => {
    const tokens = await getTokens();

    if (!tokens || tokens.length === 0) {
      console.log("No tokens registered. Skipping message.");
      return;
    }

    const multicastMessage = {
      tokens,
      notification: {
        title: message.title || "Hello",
        body: message.body || "This is a test notification",
        image: message.image_url || "https://via.placeholder.com/150",
      },
      data: {
        link: message.action_url || "https://example.com",
        image_url: message.image_url || "https://via.placeholder.com/150",
      },
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(multicastMessage);
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.log(`Failed token: ${tokens[idx]}, Error: ${resp.error}`);
          }
        });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });
}

startConsumer();

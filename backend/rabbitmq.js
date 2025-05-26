const amqp = require('amqplib');

let channel, connection;

async function connect() {
    connection = await amqp.connect('amqp://rabbitmq'); 
    channel = await connection.createChannel();
    console.log('✅ Connected to RabbitMQ');
    console.log(channel);
    await channel.assertQueue('notifications');
}

async function publishToQueue(message) {
    channel?.sendToQueue('notifications', Buffer.from(JSON.stringify(message)));
}

async function consumeQueue(callback) {
    await channel.consume('notifications', (msg) => {
        if (msg !== null) {
            const content = JSON.parse(msg.content.toString());
            callback(content);
            channel.ack(msg);
        }
    });
}

module.exports = { connect, publishToQueue, consumeQueue };

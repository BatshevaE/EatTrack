const { Kafka } = require('kafkajs');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001; // Choose a port for the consumer server

app.use(cors()); // Allow requests from your frontend

const kafka = new Kafka({
    clientId: 'eatTrackerConsumer',
    brokers: ['csju0q6hhb4uo561sp20.any.eu-central-1.mpx.prd.cloud.redpanda.com:9092'],
    ssl: true,
    sasl: {
        mechanism: 'scram-sha-256',
        username: 'BatshevaNoa',
        password: '1234',
    },
});

const consumer = kafka.consumer({ groupId: 'glucose_alert_group' });

(async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'glucose_alerts', fromBeginning: true });

    // SSE Endpoint
    app.get('/alerts', async (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Listen to messages and send them to the client
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const alert = JSON.parse(message.value.toString());
                res.write(`data: ${JSON.stringify(alert)}\n\n`);
            },
        });

        // Handle disconnections
        req.on('close', () => {
            console.log('Client disconnected from alerts');
            res.end();
        });
    });

    app.listen(PORT, () => {
        console.log(`Consumer server running on http://localhost:${PORT}`);
    });
})();
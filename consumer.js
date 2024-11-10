const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'eatTrackerConsumer',
    brokers: ['csju0q6hhb4uo561sp20.any.eu-central-1.mpx.prd.cloud.redpanda.com:9092'],
    ssl: true, // Enable SSL if the broker requires it
    sasl: {
      mechanism: 'scram-sha-256', // or 'scram-sha-256' / 'scram-sha-512' based on the requirement
      username: 'BatshevaNoa',
      password: '1234',
    },
  });

const consumer = kafka.consumer({ groupId: 'glucose_alerts_group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'glucose_alerts', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const alert = JSON.parse(message.value.toString());
      console.log('Received alert:', alert);
      // Logic to update your dashboard with the alert, if needed
    },
  });
};

runConsumer().catch(console.error);

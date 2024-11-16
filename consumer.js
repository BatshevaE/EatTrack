const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'eatTrackerAlertReceiver',
    brokers: ['csju0q6hhb4uo561sp20.any.eu-central-1.mpx.prd.cloud.redpanda.com:9092'],
    ssl: true,
    sasl: {
        mechanism: 'scram-sha-256',
        username: 'BatshevaNoa',
        password: '1234',
    },
});

const consumer = kafka.consumer({ groupId: 'glucose_alerts_group' });

const receiveMessages = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'glucose_alerts', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const alertData = JSON.parse(message.value.toString());
            console.log('Received alert:', alertData);
            // Trigger the popup with the alert data here
            showPopup(alertData);
        },
    });
};

const showPopup = (alertData) => {
    // Implementation for displaying popup with alert data
    const popup = window.open('', 'Alert', 'width=300,height=200');
    popup.document.write(`
        <h1>Glucose Alert</h1>
        <p>Patient: ${alertData.patientName}</p>
        <p>Glucose Level: ${alertData.glucoseLevel}</p>
        <p>Timestamp: ${new Date(alertData.timestamp).toLocaleString()}</p>
    `);
};
module.exports=receiveMessages();
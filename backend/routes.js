const express = require('express');
const router = express.Router();
const { registerToken, getTokens } = require('./tokens');
const { publishToQueue } = require('./rabbitmq');

// Register FCM token
router.post('/devices/register', (req, res) => {
    const { fcm_token } = req.body;
    if (!fcm_token) {
        return res.status(400).json({ error: 'fcm_token is required' });
    }
    registerToken(fcm_token);
    res.status(200).json({ message: 'Subscribed Successfully' });
});

// Publish notification
router.post('/notifications/publish', async (req, res) => {
    const { title, body, data, image_url, action_url } = req.body;
    const message = { title, body, data, image_url, action_url };
    await publishToQueue(message);
    res.status(200).json({ message: 'Notification queued successfully' });
});

module.exports = router;

const tokens = new Set();
const redis = require('redis');
const client = redis.createClient({ url: 'redis://redis:6379' });

client.connect();

async function registerToken(token) {
    await client.sAdd('tokens', token);
}

async function getTokens() {
    return await client.sMembers('tokens');
}

module.exports = { registerToken, getTokens };
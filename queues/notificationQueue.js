const { Queue } = require('bullmq');
const connection = require('../redis/connection');

const notificationQueue = new Queue('notifications', { connection });

module.exports = notificationQueue;

const amqp = require('amqplib');
const { QUEUE_URL } = require('../constants');
const {
  assertQueue,
  sendToQueue,
  consume
} = require('./queue');
const {
  assertExchange,
  publishMessage,
  bindQueue,
} = require('./exchange');

/**
 * @async
 * @returns connection
 */
const connect = () => amqp.connect(QUEUE_URL);

/**
 * @async
 * @param {Object} conn Connection
 * @returns {Object} Channel
 */
const createChannel = (conn) => conn.createChannel();

module.exports = {
  connect,
  createChannel,
  assertExchange,
  publishMessage,
  bindQueue,
  assertQueue,
  sendToQueue,
  consume,
};

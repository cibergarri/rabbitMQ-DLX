const { NO_ACK } = require('../constants');
/**
 * async
 * @param {Object} channel
 * @param {Object} queue queue name
 * @returns {Object} queue
 */
const assertQueue = async (channel, queue, queueOptions = {}) => {
  const options = {
    exclusive: true,
    ...queueOptions,
  };
  const result = await channel.assertQueue(queue, options);
  console.debug('Assert Queue Result:', result);
  return result;
};

/**
 * async
 * @param {Object} channel
 * @param {Object} queue queue name
 * @param {String} msg Message to be sent
 */
const sendToQueue = async (channel, queue, msg) => {
  const options = { persistent: true };
  const sent = await channel.sendToQueue(queue, Buffer.from(msg), options);
  console.log(" [x] Sent '%s'", msg);
  return sent;
};

const consume = async (channel, queue, onMessage) => {
  const options = {
    // noAck: true  -> the task is cleaned from the queue in the moment is received. Error if we call chanhel.ack
    // noAck: false -> the task is not cleaned until we call channel.ack(). Therefore if the worker is stopped before finishing it, it will take it again
    noAck: NO_ACK, // https://www.rabbitmq.com/confirms.html
  }
  const result = await channel.consume(queue, onMessage, options);
  console.log('channel consume result', result);
};

module.exports = {
  assertQueue,
  sendToQueue,
  consume,
};

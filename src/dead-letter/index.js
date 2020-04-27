const {
  connect,
  consume,
  createChannel,
  assertExchange,
  assertQueue,
  bindQueue,  
} = require('../amqp');

const onMessage = channel => (msg) => {
  if(msg.content) {
    console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
    channel.ack(msg);
  }
};

const bindToKey = (channel, queue) => (key) => bindQueue(channel, queue, key);

const init = async () => {
  const connection = await connect();
  const channel = await createChannel(connection);
  const exchangeName = `topic-dlx`;
  await assertExchange(channel, 'fanout', exchangeName);



  // const deadLetterqueueObj = await assertQueue(channel, deadLetterExchange );
  const queueOptions = {
    // exclusive: true, //  if true, scopes the queue to the connection (defaults to false)
    // durable: true // persistence in combination with excusive and autoDelete
    // autoDelete: false
  }
  const queueObj = await assertQueue(channel, 'dlx-queue', queueOptions);
  const { queue } = queueObj;
  console.log(' [*] Waiting for dead-letterd messages. To exit press CTRL+C');
  bindQueue(channel, queue, undefined, exchangeName);
  await consume(channel, queue, onMessage(channel));
  return { channel, connection, queue };
}

init().catch(console.warn);
const {
  connect,
  consume,
  createChannel,
  assertExchange,
  assertQueue,
  bindQueue,  
} = require('../amqp');

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: npm run receiver <facility>.<severity>");
  process.exit(1);
}

const onMessage = channel => (msg) => {
  if(msg.content) {
    const messageContent = msg.content.toString();
    console.log({messageContent});
    // those messages containin throw will be rejected
    if(messageContent.includes('throw')) {
      console.log('To DLX');
      const requeue = false
      channel.reject(msg, requeue);
      // const allUpTp = false
      // channel.nack(msg, allUpTp, requeue);
      return;
    }
    console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
    channel.ack(msg);
  }
};

const bindToKey = (channel, queue) => (key) => bindQueue(channel, queue, key);



const init = async () => {
  const connection = await connect();
  const channel = await createChannel(connection);
  await assertExchange(channel, 'topic');
  const queueName = `logs-${args.join('-')}`;
  const deadLetterExchange = `topic-dlx`;

  const queueOptions = {
    // exclusive: true, //  if true, scopes the queue to the connection (defaults to false)
    // durable: true // persistence in combination with excusive and autoDelete
    // autoDelete: false
    deadLetterExchange
  }
  const queueObj = await assertQueue(channel, queueName, queueOptions);
  const { queue } = queueObj;
  console.log(' [*] Waiting for logs. To exit press CTRL+C');
  await Promise.all(args.map(bindToKey(channel, queue)));
  await consume(channel, queue, onMessage(channel));
  return { channel, connection, queue };
}

init().catch(console.warn);
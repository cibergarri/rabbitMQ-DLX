const {
  connect,
  createChannel,
  assertExchange,
  publishMessage,
} = require('../amqp');

const args = process.argv.slice(2);
const key = (args.length > 0) ? args[0] : 'anonymous.info';
const msg = args.slice(1).join(' ') || 'Hello World!';

const emit = async () => {
  const connection = await connect();
  const channel = await createChannel(connection);
  await assertExchange(channel, 'topic');
  await publishMessage(channel, key, msg);
  console.log(" [x] Sent %s: '%s'", key, msg);
  setTimeout(() => { 
    connection.close(); 
    process.exit(0); 
  }, 500);
};

emit();
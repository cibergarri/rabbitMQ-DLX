
DLX -> Dead Letter Exchange

Routing allowed symbols:

 - '#' -> can substitute for zero or more words.
 - '*' -> can substitute for exactly one word.

Example: Logger with different severities from different parts of the app handled in one or more queues

start rabbitMQ in docker:
```
 docker run -d --name amqp.test -p 5672:5672 -p 15672:15672 rabbitmq
```

INSIDE rabbitMQ machine:
 - Enable rabbitMQ management:
```
  rabbitmq-plugins enable rabbitmq_management
```

 - Create managemnt user:
```
  rabbitmqctl add_user {{user}} {{password}}
  rabbitmqctl set_user_tags {{user}} administrator
```

Start one log receiver for ALL logs:
```
npm run receiver '#'
```

Start one log receiver for logs from kernel:
```
npm run receiver 'kern.*'
```

Start one log receiver for critical errors anywhere
```
npm run receiver '*.critical'
```

Start one log receiver for all logs from kernel and for all critical logs:
```
npm run receiver 'kern.*' '*.critical'
```

Send logs
```
npm run emitter "kern.critical" "A critical kernel error"
npm run emitter "kern.warning" "A warning from kernel"
npm run emitter "cron.warning" "A warning from cron"
npm run emitter "core.critical" "A critical core error"
```
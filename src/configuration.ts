export default () => ({
    rabbitmq: {
        host: process.env.RABBITMQ_SERVER,
        exchange: process.env.RABBITMQ_SERVICE_NAME,
        queue: process.env.RABBITMQ_SERVICE_QUEUE_NAME,
    },
})

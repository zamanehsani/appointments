import amqp, { Channel, Connection } from "amqplib";

class RabbitMQ {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  async connect(): Promise<void> {
    try {
      if (this.connection) return;
      this.connection = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672"
      );
      this.channel = await this.connection.createChannel();
      console.log("Successfully connected to rabbitmq");
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      throw new Error("Error connecting to RabbitMQ");
    }
  }

  async ensureChannel(): Promise<Channel> {
    if (!this.channel || !this.connection) {
      await this.connect();
    }
    return this.channel!;
  }

  async publish(
    exchange: string,
    routingKey: string,
    message: any
  ): Promise<void> {
    try {
      const channel = await this.ensureChannel();
      await channel.assertExchange(exchange, "direct", { durable: true });
      channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message))
      );
      console.log(`[x] Sent ${JSON.stringify(message)}`);
    } catch (error) {
      console.error("Error publishing to RabbitMQ:", error);
      throw new Error("Error publishing to RabbitMQ");
    }
  }

  async consume(
    queue: string,
    callback: (message: any) => void
  ): Promise<void> {
    try {
      const channel = await this.ensureChannel();
      await channel.assertQueue(queue, { durable: true });
      await channel.consume(queue, (message) => {
        if (message) {
          callback(JSON.parse(message.content.toString()));
          console.log(`[x] Received ${message.content.toString()}`);
          channel.ack(message);
        }
      });
    } catch (error) {
      console.error("Error consuming from RabbitMQ:", error);
      throw new Error("Error consuming from RabbitMQ");
    }
  }

  async close(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
        this.channel = null;
      }
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
    }
  }
}

export default new RabbitMQ();

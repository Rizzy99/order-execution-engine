
import Fastify from "fastify";
import websocket from "fastify-websocket";
import { orderRoutes } from "./routes/orderRoutes";
import { QueueService } from "./services/QueueService";
import { WebSocketManager } from "./ws/WebSocketManager";

const fastify = Fastify({ logger: true });
fastify.register(websocket);

const port = Number(process.env.PORT || 3000);

fastify.register(orderRoutes, { prefix: "/api" });

const start = async () => {
  try {
    await fastify.listen({ port, host: "0.0.0.0" });
    fastify.log.info(`Server listening on ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

QueueService.initialize();
WebSocketManager.initialize();

start();

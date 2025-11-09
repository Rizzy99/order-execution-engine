
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { WebSocketManager } from "../ws/WebSocketManager";
import { OrderService } from "../services/OrderService";

export async function orderRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.post("/orders/execute", { websocket: true }, async (request: any, reply: any) => {
    // Read payload
    const payload = request.body || request.query || {};
    // Basic validation
    if (!payload.tokenIn || !payload.tokenOut || !payload.amount) {
      reply.status(400).send({ error: "tokenIn, tokenOut and amount are required" });
      return;
    }
    const orderId = uuidv4();
    // Enqueue order and start websocket streaming on the same connection
    // fastify-websocket exposes `request.socket` and `reply.socket` when websocket:true
    // We'll use the WebSocketManager to bind the socket to this orderId
    try {
      await OrderService.createAndEnqueueOrder(orderId, payload);
      // Upgrade connection -- fastify-websocket provides `request.socket` with `ws` property
      const ws = request.websocket;
      if (ws) {
        WebSocketManager.bindSocket(orderId, ws);
        // Immediately emit pending
        WebSocketManager.emitStatus(orderId, { status: "pending", orderId });
      } else {
        // If websocket is not present, reply with orderId only
        reply.send({ orderId });
      }
    } catch (err: any) {
      reply.status(500).send({ error: err.message || "unknown error" });
    }
  });
}

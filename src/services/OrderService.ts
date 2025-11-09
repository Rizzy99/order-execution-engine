
import { QueueService } from "./QueueService";
import { WebSocketManager } from "../ws/WebSocketManager";

export class OrderService {
  static async createAndEnqueueOrder(orderId: string, payload: any) {
    // persist minimal order to Redis or Postgres in real app (skipped here)
    const order = {
      id: orderId,
      type: "market",
      tokenIn: payload.tokenIn,
      tokenOut: payload.tokenOut,
      amount: payload.amount,
      createdAt: Date.now()
    };
    // Bind a simple initial status
    WebSocketManager.emitStatus(orderId, { status: "queued", orderId });
    await QueueService.enqueue(order);
    return order;
  }
}

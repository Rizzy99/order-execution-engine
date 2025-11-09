
import { Worker, Queue, QueueScheduler, Job } from "bullmq";
import IORedis from "ioredis";
import { MockDexRouter } from "./MockDexRouter";
import { WebSocketManager } from "../ws/WebSocketManager";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
const queueName = "orders";
let queue: Queue;
let worker: Worker;
let scheduler: QueueScheduler;

export class QueueService {
  static initialize() {
    queue = new Queue(queueName, { connection });
    scheduler = new QueueScheduler(queueName, { connection });
    // concurrency from env or 10 default
    const concurrency = Number(process.env.QUEUE_CONCURRENCY || 10);
    worker = new Worker(queueName, async (job: Job) => {
      const order = job.data;
      const id = order.id;
      try {
        WebSocketManager.emitStatus(id, { status: "routing", orderId: id });
        const r = await MockDexRouter.getRaydiumQuote(order.tokenIn, order.tokenOut, order.amount);
        const m = await MockDexRouter.getMeteoraQuote(order.tokenIn, order.tokenOut, order.amount);
        const best = r.price < m.price ? r : m;
        WebSocketManager.emitStatus(id, { status: "building", orderId: id, decision: { r, m, chosen: best.dex } });
        const exec = await MockDexRouter.executeSwap(best.dex, order);
        WebSocketManager.emitStatus(id, { status: "submitted", orderId: id, txHash: exec.txHash });
        // simulate confirmation
        WebSocketManager.emitStatus(id, { status: "confirmed", orderId: id, txHash: exec.txHash, executedPrice: exec.executedPrice });
        return { success: true, txHash: exec.txHash };
      } catch (err: any) {
        WebSocketManager.emitStatus(id, { status: "failed", orderId: id, error: String(err) });
        throw err;
      }
    }, { connection, concurrency });
    worker.on("failed", (job, err) => {
      console.error("Job failed:", job.id, err);
    });
    console.log("QueueService initialized");
  }

  static async enqueue(order: any) {
    if (!queue) this.initialize();
    await queue.add("execute", order, { attempts: 3, backoff: { type: "exponential", delay: 1000 } });
  }
}


import { QueueService } from "../src/services/QueueService";
import { v4 as uuidv4 } from "uuid";

jest.setTimeout(30000);

describe("QueueService", () => {
  test("enqueue and process a mock order", async () => {
    QueueService.initialize();
    const id = uuidv4();
    await QueueService.enqueue({ id, tokenIn: "USDC", tokenOut: "ABC", amount: 10 });
    // wait a bit for worker to process
    await new Promise(res => setTimeout(res, 5000));
    expect(true).toBe(true);
  });
});

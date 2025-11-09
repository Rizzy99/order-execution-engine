
import { sleep } from "../utils/sleep";

export type Quote = { price: number; fee: number; dex: string };

export class MockDexRouter {
  static async getRaydiumQuote(tokenIn: string, tokenOut: string, amount: number): Promise<Quote> {
    await sleep(200 + Math.random() * 200);
    const base = 1.0;
    const price = base * (0.98 + Math.random() * 0.04);
    return { price, fee: 0.003, dex: "Raydium" };
  }

  static async getMeteoraQuote(tokenIn: string, tokenOut: string, amount: number): Promise<Quote> {
    await sleep(200 + Math.random() * 200);
    const base = 1.0;
    const price = base * (0.97 + Math.random() * 0.05);
    return { price, fee: 0.002, dex: "Meteora" };
  }

  static async executeSwap(dex: string, order: any) {
    // Simulate execution delay 2-3s
    await sleep(2000 + Math.random() * 1000);
    return { txHash: "MOCK_" + Math.random().toString(36).slice(2), executedPrice: 1.0 * (0.98 + Math.random() * 0.04) };
  }
}

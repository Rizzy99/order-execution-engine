
import { MockDexRouter } from "../src/services/MockDexRouter";

describe("MockDexRouter", () => {
  test("returns quotes and executes", async () => {
    const r = await MockDexRouter.getRaydiumQuote("USDC","ABC",100);
    const m = await MockDexRouter.getMeteoraQuote("USDC","ABC",100);
    expect(typeof r.price).toBe("number");
    expect(typeof m.price).toBe("number");
    const exec = await MockDexRouter.executeSwap(r.dex, {id:"test"});
    expect(exec.txHash.startsWith("MOCK_")).toBe(true);
  }, 20000);
});

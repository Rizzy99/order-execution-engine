
type WS = any;
const socketsByOrder: Map<string, WS[]> = new Map();

export const WebSocketManager = {
  initialize() {
    // nothing to init for now
    console.log("WebSocketManager ready");
  },

  bindSocket(orderId: string, ws: any) {
    const arr = socketsByOrder.get(orderId) || [];
    arr.push(ws);
    socketsByOrder.set(orderId, arr);
    ws.on("close", () => {
      const cur = socketsByOrder.get(orderId) || [];
      socketsByOrder.set(orderId, cur.filter((s: any) => s !== ws));
    });
  },

  emitStatus(orderId: string, payload: any) {
    const arr = socketsByOrder.get(orderId) || [];
    // attach timestamp
    const message = { timestamp: Date.now(), ...payload };
    arr.forEach((ws: any) => {
      try {
        ws.send(JSON.stringify(message));
      } catch (e) {
        // ignore
      }
    });
    // also log to server console for visibility
    console.log("Emit:", JSON.stringify(message));
  }
};

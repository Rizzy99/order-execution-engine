
# Order Execution Engine (Mock) — Market Orders

This repository contains a **mock** Order Execution Engine built with **Node.js + TypeScript**.
It implements a single order type (**Market Order**) with:
- DEX routing simulation (Raydium vs Meteora)
- WebSocket streaming of order lifecycle (pending → routing → building → submitted → confirmed/failed)
- Queue management with **BullMQ** (Redis)
- Exponential backoff retry (≤3 attempts)
- PostgreSQL schemas provided (no heavy ORM required for the mock)

Why Market Order?
- Market orders are immediate and easiest to demonstrate the routing + execution lifecycle.
- Extending: **Limit orders** require a price-watching component (pub/sub or scheduled price checks). **Sniper orders** require monitoring for new token listings and a trigger service — both can be added as separate processors reusing the same `QueueService` and `WebSocketManager`.

## What you get
- Fully structured TypeScript project you can push to GitHub.
- `docker-compose.yml` to run Redis and Postgres locally.
- Basic unit tests (Jest) for routing + queue behavior.
- Postman collection sample.

## Quick start (mock)
1. Install dependencies:
```bash
npm install
```

2. Start Redis + Postgres (recommended via Docker):
```bash
docker-compose up -d
```

3. Start server:
```bash
npm run start
```

4. Submit an order:
```bash
curl -N -H "Content-Type: application/json" -X POST   http://localhost:3000/api/orders/execute   -d '{"tokenIn":"USDC","tokenOut":"ABC","amount":1000}'
```
The same connection will upgrade to WebSocket and stream events (see examples in `src/ws/WebSocketManager.ts`).

## Structure
See `src/` for core services:
- `MockDexRouter` — simulates Raydium/Meteora quotes and execution
- `OrderService` — validation, order creation, enqueueing
- `QueueService` — bullmq worker, concurrency, retries
- `WebSocketManager` — binds HTTP POST → WebSocket flow for streaming status

## Tests
```bash
npm test
```

## Notes
- This is a mock implementation intended for demonstration and grading. Replace `MockDexRouter` with real SDK calls to run on Solana devnet.
- Environment variables: See `.env.example`.


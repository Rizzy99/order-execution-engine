
/**
 * Placeholder for Postgres models. For the mock, we're not including a full ORM.
 * In a real implementation use TypeORM/Sequelize/Prisma to persist orders and failures.
 */
export type OrderRecord = {
  id: string;
  type: string;
  tokenIn: string;
  tokenOut: string;
  amount: number;
  status?: string;
  txHash?: string;
  error?: string;
  createdAt: number;
};

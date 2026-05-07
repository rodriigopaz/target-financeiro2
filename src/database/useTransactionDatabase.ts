import { useSQLiteContext } from 'expo-sqlite';

export type Transaction = {
  id: number;
  target_id: number;
  amount: number;
  observation: string;
  created_at: string;
};

export function useTransactionDatabase() {
  const db = useSQLiteContext();

  async function create(target_id: number, amount: number, observation: string) {
    const statement = await db.prepareAsync(
      'INSERT INTO transactions (target_id, amount, observation) VALUES ($target_id, $amount, $observation)'
    );
    try {
      const result = await statement.executeAsync({
        $target_id: target_id,
        $amount: amount,
        $observation: observation,
      });
      return result.lastInsertRowId;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function getByTarget(target_id: number) {
    try {
      return await db.getAllAsync<Transaction>(
        'SELECT * FROM transactions WHERE target_id = ? ORDER BY created_at DESC',
        target_id
      );
    } catch (error) {
      throw error;
    }
  }

  return { create, getByTarget };
}
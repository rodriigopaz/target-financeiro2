import { useSQLiteContext } from 'expo-sqlite';

export type Target = {
  id: number;
  name: string;
  amount: number;
  accumulated: number;
};

export function useTargetDatabase() {
  const db = useSQLiteContext();

  async function create(name: string, amount: number) {
    const statement = await db.prepareAsync(
      'INSERT INTO targets (name, amount) VALUES ($name, $amount)'
    );
    try {
      const result = await statement.executeAsync({ $name: name, $amount: amount });
      return result.lastInsertRowId;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function getAll() {
    try {
      const query = `
        SELECT t.*, COALESCE(SUM(tr.amount), 0) AS accumulated 
        FROM targets t 
        LEFT JOIN transactions tr ON tr.target_id = t.id 
        GROUP BY t.id
        ORDER BY (COALESCE(SUM(tr.amount), 0) / t.amount) DESC
      `;
      return await db.getAllAsync<Target>(query);
    } catch (error) {
      throw error;
    }
  }

  async function remove(id: number) {
    try {
      await db.runAsync('DELETE FROM targets WHERE id = ?', id);
    } catch (error) {
      throw error;
    }
  }

  return { create, getAll, remove };
}
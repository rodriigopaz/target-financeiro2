import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useTargetDatabase, Target } from '../database/useTargetDatabase';

export default function Home() {
  const targetDatabase = useTargetDatabase();
  const [targets, setTargets] = useState<Target[]>([]);

  async function loadData() {
    try {
      const data = await targetDatabase.getAll();
      setTargets(data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddTarget() {
    try {
      await targetDatabase.create("Comprar Carro", 50000);
      loadData(); 
    } catch (error) {
      console.error("Erro ao inserir:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>As Minhas Metas</Text>
      
      <Button 
        title="Adicionar Meta de Teste" 
        onPress={handleAddTarget} 
        color="#10b981" 
      />
      
      <FlatList 
        data={targets}
        keyExtractor={(item) => String(item.id)}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              Objetivo: {item.amount} | Acumulado: {item.accumulated}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    marginTop: 50,
    backgroundColor: '#0f172a' 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 20,
    textAlign: 'center'
  },
  item: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginBottom: 10
  },
  itemName: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: 'bold'
  },
  itemDetails: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 5
  }
});
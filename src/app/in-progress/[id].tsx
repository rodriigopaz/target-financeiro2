import { useEffect, useState, useCallback } from 'react'
import { View, Alert } from 'react-native'
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router'

import { Button } from '@/components/Button'
import { List } from '@/components/List'
import { PageHeader } from '@/components/PageHeader'
import { Progress } from '@/components/Progress'
import { Transaction, TransactionProps } from '@/components/Transaction'
import { TransactionTypes } from '@/utils/TransactionTypes'

import { useTargetDatabase, Target as TargetType } from '@/database/useTargetDatabase'
import { useTransactionDatabase } from '@/database/useTransactionDatabase'

export default function InProgress() {
  const params = useLocalSearchParams<{ id: string }>()
  const targetId = Number(params.id)

  const [target, setTarget] = useState<TargetType | null>(null)
  const [transactions, setTransactions] = useState<TransactionProps[]>([])

  const targetDatabase = useTargetDatabase()
  const transactionDatabase = useTransactionDatabase()

  async function loadData() {
    try {
      const allTargets = await targetDatabase.getAll()
      const currentTarget = allTargets.find(t => t.id === targetId)
      
      if (currentTarget) {
        setTarget(currentTarget)
      }

      const dbTransactions = await transactionDatabase.getByTarget(targetId)
      const formattedTransactions = dbTransactions.map(t => ({
        id: String(t.id),
        value: `R$ ${Math.abs(t.amount).toFixed(2).replace('.', ',')}`,
        date: new Date(t.created_at).toLocaleDateString('pt-BR'),
        description: t.observation,
        type: t.amount >= 0 ? TransactionTypes.Input : TransactionTypes.Output
      }))

      setTransactions(formattedTransactions)
    } catch (error) {
      console.error(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [targetId])
  )

  async function handleDeleteTarget() {
    Alert.alert('Excluir Meta', 'Tem certeza que deseja excluir esta meta? Todas as transações vinculadas também serão apagadas.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await targetDatabase.remove(targetId)
            Alert.alert('Sucesso', 'Meta excluída!')
            router.navigate('/')
          } catch (error) {
            console.error(error)
          }
        }
      }
    ])
  }

  if (!target) return <View style={{ flex: 1, backgroundColor: '#0f172a' }} />

  const progressPercentage = target.amount > 0 ? Math.min((target.accumulated / target.amount) * 100, 100) : 0

  return (
    <View style={{ flex: 1, padding: 24, gap: 32, backgroundColor: '#0f172a' }}>
      <PageHeader
        title={target.name}
        rightButton={{
          icon: 'delete', 
          onPress: handleDeleteTarget,
        }}
      />

      <Progress 
        data={{
          current: `R$ ${target.accumulated.toFixed(2).replace('.', ',')}`,
          target: `R$ ${target.amount.toFixed(2).replace('.', ',')}`,
          percentage: progressPercentage,
        }} 
      />

      <List
        title="Transações"
        data={transactions}
        renderItem={({ item }) => (
          <Transaction data={item} onRemove={() => {}} />
        )}
        emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
      />

      <Button
        title="Nova transação"
        onPress={() => router.navigate(`/transaction/${params.id}`)}
      />
    </View>
  )
}
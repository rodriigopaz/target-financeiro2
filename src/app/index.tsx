import { useCallback, useState } from 'react'
import { View, Alert } from 'react-native'
import { router, useFocusEffect } from 'expo-router'

import { HomeHeader } from '@/components/HomeHeader'
import { List } from '@/components/List'
import { Target } from '@/components/Target'

import { useTargetDatabase, Target as TargetType } from '@/database/useTargetDatabase'

export default function Home() {
  const [targets, setTargets] = useState<TargetType[]>([])
  const targetDatabase = useTargetDatabase()

  const totalAccumulated = targets.reduce((acc, target) => acc + target.accumulated, 0)
  const totalAmount = targets.reduce((acc, target) => acc + target.amount, 0)

  async function fetchData() {
    try {
      const data = await targetDatabase.getAll()
      setTargets(data)
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as metas.')
      console.error(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  return (
    <View style={{ flex: 1, padding: 24, gap: 32, backgroundColor: '#0f172a' }}>
      
      <HomeHeader 
        data={{
          total: `R$ ${totalAccumulated.toFixed(2).replace('.', ',')}`,
          input: { 
            label: 'Acumulado', 
            value: `R$ ${totalAccumulated.toFixed(2).replace('.', ',')}` 
          },
          output: { 
            label: 'Objetivo final', 
            value: `R$ ${totalAmount.toFixed(2).replace('.', ',')}` 
          }
        }}
      />
      
      <List
        title="Minhas metas"
        data={targets}
        renderItem={({ item }) => {
          const percentageValue = item.amount > 0 ? Math.min((item.accumulated / item.amount) * 100, 100) : 0;
          
          return (
            <Target
              data={{
                name: item.name,
                current: `R$ ${item.accumulated.toFixed(2).replace('.', ',')}`,
                target: `R$ ${item.amount.toFixed(2).replace('.', ',')}`,
                percentage: `${percentageValue.toFixed(0)}%`,
              }}
              onPress={() => router.navigate(`/in-progress/${item.id}`)}
            />
          )
        }}
        emptyMessage="Nenhuma meta cadastrada. Que tal criar uma agora?"
      />
    </View>
  )
}
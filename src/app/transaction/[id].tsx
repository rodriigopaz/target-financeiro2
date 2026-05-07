import { useState } from 'react'
import { View, Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

import { Button } from '@/components/Button'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Input } from '@/components/Input'
import { PageHeader } from '@/components/PageHeader'
import { TransactionType } from '@/components/TransactionType'
import { TransactionTypes } from '@/utils/TransactionTypes'
import { useTransactionDatabase } from '@/database/useTransactionDatabase'

export default function Transaction() {
  const [type, setType] = useState(TransactionTypes.Input)
  const [amount, setAmount] = useState(0)
  const [observation, setObservation] = useState('')
  
  const params = useLocalSearchParams<{ id: string }>()
  const transactionDatabase = useTransactionDatabase()

  async function handleSave() {
    if (amount <= 0) {
      return Alert.alert('Aviso', 'Preencha um valor maior que zero.')
    }
    if (observation.trim() === '') {
      return Alert.alert('Aviso', 'Preencha o motivo da transação.')
    }

    try {
      const finalAmount = type === TransactionTypes.Output ? -amount : amount;

      await transactionDatabase.create(Number(params.id), finalAmount, observation)
      Alert.alert('Sucesso', 'Transação registrada com sucesso!')
      router.back() 
    } catch (error) {
      console.error(error)
      Alert.alert('Erro', 'Não foi possível registrar a transação.')
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: '#0f172a' }}>
      <PageHeader
        title="Nova transação"
        subtitle="A cada valor guardado você fica mais próximo da sua meta. Se esforce para guardar e evitar retirar."
      />

      <View style={{ marginTop: 32, gap: 24 }}>
        <TransactionType selected={type} onChange={setType} />

        <CurrencyInput 
          label="Valor (R$)" 
          value={amount} 
          onChangeValue={(value) => setAmount(value ?? 0)} 
        />

        <Input
          label="Motivo"
          placeholder="Ex: Investir em CDB de 110% no banco XPTO"
          value={observation}
          onChangeText={setObservation}
        />

        <Button title="Salvar" onPress={handleSave} />
      </View>
    </View>
  )
}
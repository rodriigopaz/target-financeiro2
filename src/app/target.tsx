import { useState } from 'react'
import { View, Alert } from 'react-native'
import { router } from 'expo-router'
import { Button } from '@/components/Button'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Input } from '@/components/Input'
import { PageHeader } from '@/components/PageHeader'
import { useTargetDatabase } from '@/database/useTargetDatabase'

export default function Target() {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState(0)

  const targetDatabase = useTargetDatabase()

  async function handleSave() {
    if (name.trim() === '' || amount <= 0) {
      return Alert.alert('Aviso', 'Preencha o nome da meta e um valor maior que zero.')
    }

    try {
      await targetDatabase.create(name, amount)
      Alert.alert('Sucesso', 'Meta cadastrada com sucesso!')
      router.back() 
    } catch (error) {
      console.error(error)
      Alert.alert('Erro', 'Não foi possível salvar a meta.')
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: '#0f172a' }}>
      <PageHeader
        title="Meta"
        subtitle="Economize para alcançar sua meta financeira."
      />

      <View style={{ marginTop: 32, gap: 24 }}>
        <Input
          label="Nova meta"
          placeholder="Ex: Viagem para praia, Apple Watch"
          value={name}
          onChangeText={setName}
        />

        <CurrencyInput 
          label="Valor alvo (R$)" 
          value={amount} 
          onChangeValue={(value) => setAmount(value ?? 0)} 
        />

        <Button title="Salvar" onPress={handleSave} />
      </View>
    </View>
  )
}